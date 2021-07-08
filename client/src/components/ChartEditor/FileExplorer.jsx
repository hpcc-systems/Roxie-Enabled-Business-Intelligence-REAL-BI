import React from 'react';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { LinearProgress, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Box from '@material-ui/core/Box';

import { getTreeViewData } from '../../utils/hpcc';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles({
  loader: { width: '25%', marginLeft: '5px' },
});

const initial = {
  id: 'root',
  name: 'File Explorer',
  isDirectory: true,
  children: [],
};

export default function ControlledTreeView({ clusterId, formFieldsUpdate }) {
  const { enqueueSnackbar } = useSnackbar();

  const [clusterFiles, setClusterFiles] = React.useState(initial);
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);

  const isMounted = React.useRef(true); // Using this variable to unsubscibe from state update if component is unmounted

  const classes = useStyles();

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
      setExpanded([]);
      setSelected([]);
      setClusterFiles(initial);
    };
  }, []);

  const handleToggle = (event, nodeIds) => {
    const clickedNodeId = nodeIds.filter(x => !expanded.includes(x))[0];
    getDataOnExpand(clickedNodeId);
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    const [currentNodeRef] = findNodeRef(clusterFiles, nodeIds);

    if (!currentNodeRef.isDirectory) {
      formFieldsUpdate({
        keywordfromExplorer: true,
        error: '',
        keyword: `${currentNodeRef.name}`,
        sources: [currentNodeRef],
        selectedSource: currentNodeRef,
      });
      setExpanded(expanded.filter(id => id !== 'root'));
      enqueueSnackbar(`${currentNodeRef.name} file selected`, {
        variant: 'success',
        autoHideDuration: 3000,
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
          preventDuplicate: true,
        },
      });
    }
    setSelected(nodeIds);
  };

  const formatFilesToTreeview = filesFromDB =>
    filesFromDB.map(file => {
      file.id = uuidv4();
      if (file.isDirectory) {
        file.children = [];
        file.name = file.Directory;
      } else {
        file.name = file.Name || 'unknown name';
        file.cluster = file.ClusterName;
        file.hpccID = file.Name;
        file.target = 'file';
      }
      return file;
    });

  const findNodeRef = (baseNode, nodeId, path = '') => {
    if (baseNode.Directory) {
      path += (path.length ? '::' : '') + baseNode.Directory;
    }
    if (baseNode.id === nodeId) {
      return [baseNode, path.trim()];
    }
    if (baseNode.children) {
      for (const childNode of baseNode.children) {
        const found = findNodeRef(childNode, nodeId, path);
        if (found) return found;
      }
    }
    return null;
  };

  const getDataOnExpand = async nodeId => {
    if (!nodeId) return;

    const [currentNode, path] = findNodeRef(clusterFiles, nodeId);

    if (currentNode.children.length > 0) return; // this node has been opened before, no need to refetch
    currentNode.isLoading = true;

    const results = await getTreeViewData(path, clusterId);

    const files = results.DFUFileViewResponse?.DFULogicalFiles?.DFULogicalFile;

    if (files) {
      currentNode.isLoading = false;
      currentNode.emptyDir = false;
      currentNode.children = formatFilesToTreeview(files);
      if (!isMounted.current) return null;
      setClusterFiles(prevTree => ({ ...prevTree, currentNode }));
    } else {
      currentNode.isLoading = false;
      currentNode.emptyDir = true;
      if (!isMounted.current) return null;
      setClusterFiles(prevTree => ({ ...prevTree, currentNode }));
    }
  };

  const renderAsFolder = nodesArr => {
    if (nodesArr.length) return nodesArr.map(node => renderTree(node));
    return <div />;
  };

  const getTreeItemLable = nodes => {
    return (
      <Box display='flex' alignItems='center'>
        <Typography variant='body2' component='p'>
          {nodes.emptyDir ? `${nodes.name} (empty directory)` : nodes.name}
        </Typography>
        {nodes.isLoading ? <LinearProgress className={classes.loader} /> : null}
      </Box>
    );
  };

  const renderTree = nodes => {
    return (
      <TreeItem key={nodes.id} nodeId={nodes.id} label={getTreeItemLable(nodes)}>
        {Array.isArray(nodes.children) ? renderAsFolder(nodes.children) : null}
      </TreeItem>
    );
  };

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      selected={selected}
      onNodeToggle={handleToggle}
      onNodeSelect={handleSelect}
    >
      {renderTree(clusterFiles)}
    </TreeView>
  );
}
