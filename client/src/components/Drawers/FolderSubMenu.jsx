import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ListItemIcon, Menu, MenuItem, Typography } from '@material-ui/core';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  CreateNewFolderTwoTone as CreateNewFolderTwoToneIcon,
  InsertChartTwoTone as InsertChartTwoToneIcon,
} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  blueIcon: { color: theme.palette.info.main },
  menuIcon: { minWidth: 35, maxWidth: 35 },
}));

const FolderSubMenu = ({
  addNewDashboard,
  addNewFolder,
  anchorEl,
  directoryObj,
  editFolder,
  removeFolder,
  root,
  setAnchorEl,
  setAnchorName,
}) => {
  const { blueIcon, menuIcon } = useStyles();

  const closeMenu = event => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(null);
    setAnchorName('');
  };

  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
      <MenuItem
        onClick={event => {
          addNewDashboard(root ? 'root' : directoryObj.id);
          closeMenu(event);
        }}
      >
        <ListItemIcon className={menuIcon}>
          <InsertChartTwoToneIcon className={blueIcon} />
        </ListItemIcon>
        <Typography>Create Dashboard</Typography>
      </MenuItem>
      <MenuItem
        onClick={event => {
          addNewFolder(root ? 'root' : directoryObj.id);
          closeMenu(event);
        }}
      >
        <ListItemIcon className={menuIcon}>
          <CreateNewFolderTwoToneIcon className={blueIcon} />
        </ListItemIcon>
        <Typography>Create Folder</Typography>
      </MenuItem>
      {!root && (
        <MenuItem
          onClick={event => {
            editFolder(directoryObj);
            closeMenu(event);
          }}
        >
          <ListItemIcon className={menuIcon}>
            <EditIcon />
          </ListItemIcon>
          <Typography>Edit Folder</Typography>
        </MenuItem>
      )}
      {!root && (
        <MenuItem
          onClick={event => {
            removeFolder(directoryObj);
            closeMenu(event);
          }}
        >
          <ListItemIcon className={menuIcon}>
            <CloseIcon />
          </ListItemIcon>
          <Typography>Delete Folder</Typography>
        </MenuItem>
      )}
    </Menu>
  );
};

export default FolderSubMenu;
