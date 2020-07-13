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
  redIcon: { color: red[500] },
}));

const DashboardSubMenu = ({
  anchorEl,
  deleteDashboard,
  directoryObj,
  editDashboard,
  setAnchorEl,
  setAnchorName,
  updateDirectoryObj,
}) => {
  const { favorite, id } = directoryObj;
  const { redIcon } = useStyles();

  const closeMenu = () => {
    setAnchorEl(null);
    setAnchorName('');
  };

  return (
    <Menu id='dashboardSubMenu' anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
      <MenuItem
        onClick={() => {
          updateDirectoryObj(id, 'favorite', !favorite);
          closeMenu();
        }}
      >
        <ListItemIcon>
          {favorite ? <FavoriteTwoToneIcon className={redIcon} /> : <FavoriteBorderIcon />}
        </ListItemIcon>
        <Typography>{favorite ? 'Unpin Dashboard' : 'Pin Dashboard'}</Typography>
      </MenuItem>
      <MenuItem
        onClick={() => {
          editDashboard(directoryObj);
          closeMenu();
        }}
      >
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        <Typography>Edit Dashboard</Typography>
      </MenuItem>
      <MenuItem
        onClick={() => {
          deleteDashboard(id);
          closeMenu();
        }}
      >
        <ListItemIcon>
          <CloseIcon />
        </ListItemIcon>
        <Typography>Delete Dashboard</Typography>
      </MenuItem>
    </Menu>
  );
};

export default DashboardSubMenu;
