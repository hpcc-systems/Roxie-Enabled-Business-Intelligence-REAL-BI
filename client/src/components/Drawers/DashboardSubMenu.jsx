import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ListItemIcon, Menu, MenuItem, Typography } from '@material-ui/core';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  FavoriteTwoTone as FavoriteTwoToneIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@material-ui/icons';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles(() => ({
  menuIcon: { minWidth: 35, maxWidth: 35 },
  redIcon: { color: red[500] },
}));

const DashboardSubMenu = ({
  anchorEl,
  directoryObj,
  editDashboard,
  permission,
  removeDashboard,
  setAnchorEl,
  setAnchorName,
  updateDirectoryObj,
}) => {
  const { favorite, id } = directoryObj;
  const { menuIcon, redIcon } = useStyles();

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
          updateDirectoryObj(id, 'favorite', !favorite);
          closeMenu(event);
        }}
      >
        <ListItemIcon className={menuIcon}>
          {favorite ? <FavoriteTwoToneIcon className={redIcon} /> : <FavoriteBorderIcon />}
        </ListItemIcon>
        <Typography>{favorite ? 'Unpin' : 'Pin'}</Typography>
      </MenuItem>
      {permission === 'Owner' && (
        <div>
          <MenuItem
            onClick={event => {
              editDashboard(directoryObj);
              closeMenu(event);
            }}
          >
            <ListItemIcon className={menuIcon}>
              <EditIcon />
            </ListItemIcon>
            <Typography>Edit</Typography>
          </MenuItem>
          <MenuItem
            onClick={event => {
              removeDashboard(id);
              closeMenu(event);
            }}
          >
            <ListItemIcon className={menuIcon}>
              <CloseIcon />
            </ListItemIcon>
            <Typography>Delete</Typography>
          </MenuItem>
        </div>
      )}
    </Menu>
  );
};

export default DashboardSubMenu;
