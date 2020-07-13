import React, { Fragment, useState } from 'react';
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

// React Components
import FolderSubMenu from './FolderSubMenu';
import DashboardSubMenu from './DashboardSubMenu';

const useStyles = makeStyles(theme => ({
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

const RecursiveTreeView = props => {
  const { getDashboardInfo, getDirectoryDepth, localState } = props;
  const { directory, directoryDepth } = localState;
  const { itemDiv, labelDiv, labelIcon, labelText, rootDiv, rootText, treeItem } = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorName, setAnchorName] = useState('');

  const rootLabel = (
    <div className={rootDiv}>
      <Typography className={rootText}>Directory</Typography>
      <div id='menu'>
        <IconButton onClick={event => showMenu(event, { name: 'root' })}>
          <MoreHorizIcon />
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
          onClick={!isFolder ? () => getDashboardInfo(id) : null}
        >
          {isFolder ? children.map(node => renderTree(node)) : null}
        </TreeItem>
        <div id='menu'>
          {isFolder ? (
            <Fragment>
              <IconButton onClick={event => showMenu(event, directoryObj)}>
                <MoreHorizIcon />
              </IconButton>
              {directoryObj.name === anchorName && (
                <FolderSubMenu
                  {...props}
                  anchorEl={anchorEl}
                  directoryObj={directoryObj}
                  root={false}
                  setAnchorEl={setAnchorEl}
                  setAnchorName={setAnchorName}
                />
              )}
            </Fragment>
          ) : (
            <Fragment>
              <IconButton onClick={event => showMenu(event, directoryObj)}>
                <MoreHorizIcon />
              </IconButton>
              {directoryObj.name === anchorName && (
                <DashboardSubMenu
                  {...props}
                  anchorEl={anchorEl}
                  directoryObj={directoryObj}
                  setAnchorEl={setAnchorEl}
                  setAnchorName={setAnchorName}
                />
              )}
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
