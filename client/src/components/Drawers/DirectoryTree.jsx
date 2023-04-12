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
  iconColor: { color: grey[50] },
  labelDiv: {
    display: 'flex',
    alignItems: 'center',
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
  const { directory, directoryDepth, openDashboard, updateDirectoryDepth, workspace } = props;
  const { iconColor, labelDiv, labelIcon, labelText, rootDiv, rootText, treeItem } = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorName, setAnchorName] = useState('');
  const permission = workspace?.permission || 'Read-Only';
  const dashboards = workspace?.dashboards;

  const rootLabel = (
    <div className={rootDiv}>
      <Typography className={rootText}>Directory</Typography>
      {permission !== 'Read-Only' && (
        <div>
          <IconButton onClick={event => showMenu(event, { id: 'root' })}>
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
      )}
    </div>
  );

  const showMenu = (event, directoryObj) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setAnchorName(directoryObj.id);
  };

  const renderTree = directoryObj => {
    const { children, id, name } = directoryObj;
    const dash = dashboards.find(dash => dash.id === id);
    const dashBoardPermission = dash?.permission || permission; // this will check if we have dashboardPermission inplace if not we will fallback to workspace permission.
    const isFolder = directoryObj.children ? true : false;
    const label = (
      <div className={labelDiv}>
        {isFolder ? (
          <FolderIcon color='inherit' className={labelIcon} />
        ) : (
          <DashboardIcon color='inherit' className={labelIcon} />
        )}
        <Typography className={labelText}>{name}</Typography>
        <div>
          <IconButton onClick={event => showMenu(event, directoryObj)}>
            <MoreHorizIcon className={iconColor} />
          </IconButton>
          {directoryObj.id === anchorName &&
            (isFolder ? (
              dashBoardPermission !== 'Read-Only' ? (
                <FolderSubMenu
                  {...props}
                  anchorEl={anchorEl}
                  directoryObj={directoryObj}
                  root={false}
                  setAnchorEl={setAnchorEl}
                  setAnchorName={setAnchorName}
                />
              ) : null
            ) : (
              <DashboardSubMenu
                {...props}
                anchorEl={anchorEl}
                directoryObj={directoryObj}
                permission={dashBoardPermission}
                setAnchorEl={setAnchorEl}
                setAnchorName={setAnchorName}
              />
            ))}
        </div>
      </div>
    );

    return (
      <TreeItem
        key={id}
        className={treeItem}
        nodeId={String(id)}
        label={label}
        onClick={!isFolder ? () => openDashboard(directoryObj) : null}
      >
        {isFolder ? children.map(node => renderTree(node)) : null}
      </TreeItem>
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
