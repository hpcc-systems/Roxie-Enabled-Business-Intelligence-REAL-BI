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

const useStyles = makeStyles(theme => ({
  root: { flexGrow: 1 },
  button: { margin: `0 ${theme.spacing(1)}px`, minWidth: 25, padding: 0 },
  buttonsDiv: { marginRight: theme.spacing(2) },
  labelIcon: { marginRight: theme.spacing(1) },
  labelRoot: {
    alignItems: 'center',
    display: 'flex',
    padding: theme.spacing(1, 0),
  },
  labelText: { flexGrow: 1 },
  rootText: { fontSize: 20 },
}));

const RecursiveTreeView = ({
  addDashboard,
  addFolder,
  directory,
  getDashboardInfo,
  handleChange,
  toggleDashboardDialog,
  toggleFolderDialog,
  updateDirectoryObj,
}) => {
  const { button, buttonsDiv, labelIcon, labelRoot, labelText, root, rootText } = useStyles();
  const rootLabel = <Typography className={rootText}>Directory</Typography>;

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
              <Button className={button} onClick={() => addDashboard(id)}>
                <AddBoxIcon />
              </Button>
              <Button className={button} onClick={() => addFolder(id)}>
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
      className={root}
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
