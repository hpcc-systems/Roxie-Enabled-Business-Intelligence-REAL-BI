import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { TreeItem, TreeView } from '@material-ui/lab';
import {
  Dashboard as DashboardIcon,
  ExpandMore as ExpandMoreIcon,
  Folder as FolderIcon,
  ChevronRight as ChevronRightIcon,
} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: { flexGrow: 1 },
  labelIcon: { marginRight: theme.spacing(1) },
  labelRoot: {
    alignItems: 'center',
    display: 'flex',
    marginLeft: theme.spacing(2),
    padding: theme.spacing(0.5, 0),
  },
  labelText: { flexGrow: 1 },
}));

const RecursiveTreeView = ({ directoryObj, getDashboardInfo }) => {
  const { labelIcon, labelRoot, labelText, root } = useStyles();

  const renderTree = ({ children, id, name }) => {
    const isFolder = Boolean(children);
    const label = (
      <div className={labelRoot}>
        {isFolder ? (
          <FolderIcon color="inherit" className={labelIcon} />
        ) : (
          <DashboardIcon color="inherit" className={labelIcon} />
        )}
        <Typography className={labelText}>{name}</Typography>
      </div>
    );

    return (
      <TreeItem
        key={id}
        nodeId={String(id)}
        label={label}
        onClick={!isFolder ? () => getDashboardInfo(id) : null}
      >
        {isFolder ? children.map(node => renderTree(node)) : null}
      </TreeItem>
    );
  };

  return (
    <TreeView
      className={root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree(directoryObj)}
    </TreeView>
  );
};

export default RecursiveTreeView;
