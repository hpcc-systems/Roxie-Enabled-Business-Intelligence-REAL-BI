import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';
import { TreeItem, TreeView } from '@material-ui/lab';
import {
  AddBox as AddBoxIcon,
  CreateNewFolder as CreateNewFolderIcon,
  Dashboard as DashboardIcon,
  ExpandMore as ExpandMoreIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Folder as FolderIcon,
  ChevronRight as ChevronRightIcon,
} from '@material-ui/icons';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
  root: { flexGrow: 1 },
  rootEmpty: { marginLeft: theme.spacing(1) },
  rootText: { fontSize: 20, marginRight: theme.spacing(4) },
  button: { margin: `0 ${theme.spacing(1)}px`, minWidth: 25, padding: 0 },
  buttonsDiv: { marginRight: theme.spacing(2) },
  div: { display: 'flex' },
  labelIcon: { marginRight: theme.spacing(1) },
  labelRoot: {
    alignItems: 'center',
    display: 'flex',
    padding: theme.spacing(1, 0),
  },
  labelText: { flexGrow: 1 },
}));

const RecursiveTreeView = ({
  addNewDashboard,
  addNewFolder,
  directory,
  getDashboardInfo,
  updateDirectoryObj,
}) => {
  const {
    button,
    buttonsDiv,
    div,
    labelIcon,
    labelRoot,
    labelText,
    root,
    rootEmpty,
    rootText,
  } = useStyles();
  const rootLabel = (
    <div className={div}>
      <Typography className={rootText}>Directory</Typography>
      <Button className={button} onClick={() => addNewDashboard('root')}>
        <AddBoxIcon />
      </Button>
      <Button className={button} onClick={() => addNewFolder('root')}>
        <CreateNewFolderIcon />
      </Button>
    </div>
  );

  const renderTree = ({ children, id, name, favorite }) => {
    const isFolder = Boolean(children);
    const label = (
      <div className={labelRoot}>
        {isFolder ? (
          <FolderIcon color="inherit" className={labelIcon} />
        ) : (
          <DashboardIcon color="inherit" className={labelIcon} />
        )}
        <Typography className={labelText}>{name}</Typography>
        <div className={buttonsDiv}>
          {isFolder ? (
            <Fragment>
              <Button className={button} onClick={() => addNewDashboard(id)}>
                <AddBoxIcon />
              </Button>
              <Button className={button} onClick={() => addNewFolder(id)}>
                <CreateNewFolderIcon />
              </Button>
            </Fragment>
          ) : favorite ? (
            <Button className={button} onClick={() => updateDirectoryObj(id, 'favorite', false)}>
              <FavoriteIcon />
            </Button>
          ) : (
            <Button className={button} onClick={() => updateDirectoryObj(id, 'favorite', true)}>
              <FavoriteBorderIcon />
            </Button>
          )}
        </div>
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
      className={classNames(root, { [rootEmpty]: directory.length === 0 })}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      <TreeItem nodeId="root" label={rootLabel}>
        {directory.map(directoryObj => renderTree(directoryObj))}
      </TreeItem>
    </TreeView>
  );
};

export default RecursiveTreeView;
