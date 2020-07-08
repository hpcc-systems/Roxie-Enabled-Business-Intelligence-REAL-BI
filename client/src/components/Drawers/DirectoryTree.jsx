import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';
import { TreeItem, TreeView } from '@material-ui/lab';
import {
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Folder as FolderIcon,
  ChevronRight as ChevronRightIcon,
  CreateNewFolderTwoTone as CreateNewFolderTwoToneIcon,
  InsertChartTwoTone as InsertChartTwoToneIcon,
} from '@material-ui/icons';
import { blue } from '@material-ui/core/colors';
import classnames from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    minWidth: 25,
    padding: 0,
  },
  blueColor: { color: blue[500] },
  buttonsDiv: {
    marginRight: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: 0,
  },
  deleteBtn: {
    marginBottom: theme.spacing(0.5),
  },
  favoriteBtn: {
    marginLeft: theme.spacing(1),
  },
  itemDiv: { display: 'flex' },
  labelDiv: {
    display: 'flex',
    padding: theme.spacing(1, 0),
  },
  labelIcon: { marginRight: theme.spacing(1) },
  labelText: {
    flexGrow: 1,
    paddingTop: theme.spacing(0.5),
    paddingBottom: 0,
  },
  rootDiv: { display: 'flex' },
  rootText: {
    fontSize: 20,
    flexGrow: 1,
    padding: theme.spacing(1, 0),
  },
  treeItem: { flexGrow: 1 },
}));

const RecursiveTreeView = ({
  addNewDashboard,
  addNewFolder,
  deleteDashboard,
  deleteFolder,
  editDashboard,
  editFolder,
  getDashboardInfo,
  getDirectoryDepth,
  localState,
  updateDirectoryObj,
}) => {
  const { directory, directoryDepth } = localState;
  const {
    button,
    buttonsDiv,
    blueColor,
    deleteBtn,
    favoriteBtn,
    itemDiv,
    labelDiv,
    labelIcon,
    labelText,
    rootDiv,
    rootText,
    treeItem,
  } = useStyles();
  const rootLabel = (
    <div className={rootDiv}>
      <Typography className={rootText}>Directory</Typography>
      <div className={buttonsDiv}>
        <Tooltip title='New Dashboard'>
          <Button className={classnames(button, blueColor)} onClick={() => addNewDashboard('root')}>
            <InsertChartTwoToneIcon />
          </Button>
        </Tooltip>
        <Tooltip title='New Folder'>
          <Button className={classnames(button, blueColor)} onClick={() => addNewFolder('root')}>
            <CreateNewFolderTwoToneIcon />
          </Button>
        </Tooltip>
      </div>
    </div>
  );

  const renderTree = directoryObj => {
    const { children, id, name, favorite } = directoryObj;
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
          onClick={!isFolder ? () => getDashboardInfo(id) : null}
        >
          {isFolder ? children.map(node => renderTree(node)) : null}
        </TreeItem>
        <div className={buttonsDiv}>
          {isFolder ? (
            <Fragment>
              <Tooltip title='New Dashboard'>
                <Button className={classnames(button, blueColor)} onClick={() => addNewDashboard('root')}>
                  <InsertChartTwoToneIcon />
                </Button>
              </Tooltip>
              <Tooltip title='New Folder'>
                <Button className={classnames(button, blueColor)} onClick={() => addNewFolder('root')}>
                  <CreateNewFolderTwoToneIcon />
                </Button>
              </Tooltip>
              <Tooltip title='Edit Folder'>
                <Button className={button} onClick={() => editFolder(directoryObj)}>
                  <EditIcon />
                </Button>
              </Tooltip>
              <Tooltip title='Delete Folder'>
                <Button className={classnames(button, deleteBtn)} onClick={() => deleteFolder(directoryObj)}>
                  <CloseIcon />
                </Button>
              </Tooltip>
            </Fragment>
          ) : (
            <Fragment>
              <Button
                className={classnames(button, favoriteBtn)}
                onClick={() => updateDirectoryObj(id, 'favorite', !favorite)}
              >
                {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </Button>
              <Button className={button} onClick={() => editDashboard(directoryObj)}>
                <EditIcon />
              </Button>
              <Button className={classnames(button, deleteBtn)} onClick={() => deleteDashboard(id)}>
                <CloseIcon />
              </Button>
            </Fragment>
          )}
        </div>
      </div>
    );
  };

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={directoryDepth || []}
      onNodeToggle={(event, nodeArr) => getDirectoryDepth(nodeArr)}
    >
      <TreeItem nodeId='root' label={rootLabel}>
        {directory.map(directoryObj => renderTree(directoryObj))}
      </TreeItem>
    </TreeView>
  );
};

export default RecursiveTreeView;
