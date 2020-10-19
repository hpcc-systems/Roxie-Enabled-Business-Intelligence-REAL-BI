import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Typography } from '@material-ui/core';
import { TreeItem, TreeView } from '@material-ui/lab';
import {
  Dashboard as DashboardIcon,
  ExpandMore as ExpandMoreIcon,
  Folder as FolderIcon,
  ChevronRight as ChevronRightIcon,
  MoreHoriz as MoreHorizIcon,
} from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';

// React Components
import FolderSubMenu from './FolderSubMenu';
import DashboardSubMenu from './DashboardSubMenu';

const useStyles = makeStyles(theme => ({
  itemDiv: { display: 'flex' },
  iconColor: { color: grey[50] },
  labelDiv: {
    display: 'flex',
    padding: theme.spacing(1, 0),
  },
  labelIcon: { marginRight: theme.spacing(1), color: grey[50] },
  labelText: {
    flexGrow: 1,
    paddingTop: theme.spacing(0.5),
    paddingBottom: 0,
    color: theme.palette.primary.contrastText,
  },
  rootDiv: { display: 'flex' },
  rootText: {
    fontSize: 20,
    flexGrow: 1,
    padding: theme.spacing(1, 0),
    color: theme.palette.primary.contrastText,
  },
  treeItem: { flexGrow: 1 },
}));

const RecursiveTreeView = props => {
  const { directory, directoryDepth, openDashboard, updateDirectoryDepth } = props;
  const { iconColor, itemDiv, labelDiv, labelIcon, labelText, rootDiv, rootText, treeItem } = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorName, setAnchorName] = useState('');

  const rootLabel = (
    <div className={rootDiv}>
      <Typography className={rootText}>Directory</Typography>
      <div>
        <IconButton onClick={event => showMenu(event, { name: 'root' })}>
          <MoreHorizIcon className={iconColor} />
        </IconButton>
        {'root' === anchorName && (
          <FolderSubMenu
            {...props}
            anchorEl={anchorEl}
            directoryObj={{}}
            root={true}
            setAnchorEl={setAnchorEl}
            setAnchorName={setAnchorName}
          />
        )}
      </div>
    </div>
  );

  const showMenu = (event, directoryObj) => {
    setAnchorEl(event.currentTarget);
    setAnchorName(directoryObj.name);
  };

  const renderTree = directoryObj => {
    const { children, id, name } = directoryObj;
    const isFolder = Boolean(children);
    const label = (
      <div className={labelDiv}>
        {isFolder ? (
          <FolderIcon color='inherit' className={labelIcon} />
        ) : (
          <DashboardIcon color='inherit' className={labelIcon} />
        )}
        <Typography className={labelText}>{name}</Typography>
      </div>
    );

    return (
      <div key={id} className={itemDiv}>
        <TreeItem
          className={treeItem}
          nodeId={String(id)}
          label={label}
          onClick={!isFolder ? () => openDashboard({ id, name }) : null}
        >
          {isFolder ? children.map(node => renderTree(node)) : null}
        </TreeItem>
        <div>
          <IconButton onClick={event => showMenu(event, directoryObj)}>
            <MoreHorizIcon className={iconColor} />
          </IconButton>
          {directoryObj.name === anchorName &&
            (isFolder ? (
              <FolderSubMenu
                {...props}
                anchorEl={anchorEl}
                directoryObj={directoryObj}
                root={false}
                setAnchorEl={setAnchorEl}
                setAnchorName={setAnchorName}
              />
            ) : (
              <DashboardSubMenu
                {...props}
                anchorEl={anchorEl}
                directoryObj={directoryObj}
                setAnchorEl={setAnchorEl}
                setAnchorName={setAnchorName}
              />
            ))}
        </div>
      </div>
    );
  };

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon className={iconColor} />}
      defaultExpandIcon={<ChevronRightIcon className={iconColor} />}
      expanded={directoryDepth || []}
      onNodeToggle={(event, nodeArr) => updateDirectoryDepth(nodeArr)}
    >
      <TreeItem nodeId='root' label={rootLabel}>
        {directory.map(directoryObj => renderTree(directoryObj))}
      </TreeItem>
    </TreeView>
  );
};

export default RecursiveTreeView;
