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
  removeDashboard,
  setAnchorEl,
  setAnchorName,
  updateDirectoryObj,
}) => {
  const { favorite, id } = directoryObj;
  const { menuIcon, redIcon } = useStyles();

  const closeMenu = () => {
    setAnchorEl(null);
    setAnchorName('');
  };

  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
      <MenuItem
        onClick={() => {
          updateDirectoryObj(id, 'favorite', !favorite);
          closeMenu();
        }}
      >
        <ListItemIcon className={menuIcon}>
          {favorite ? <FavoriteTwoToneIcon className={redIcon} /> : <FavoriteBorderIcon />}
        </ListItemIcon>
        <Typography>{favorite ? 'Unpin' : 'Pin'}</Typography>
      </MenuItem>
      <MenuItem
        onClick={() => {
          editDashboard(directoryObj);
          closeMenu();
        }}
      >
        <ListItemIcon className={menuIcon}>
          <EditIcon />
        </ListItemIcon>
        <Typography>Edit</Typography>
      </MenuItem>
      <MenuItem
        onClick={() => {
          removeDashboard(id);
          closeMenu();
        }}
      >
        <ListItemIcon className={menuIcon}>
          <CloseIcon />
        </ListItemIcon>
        <Typography>Delete</Typography>
      </MenuItem>
    </Menu>
  );
};

export default DashboardSubMenu;
