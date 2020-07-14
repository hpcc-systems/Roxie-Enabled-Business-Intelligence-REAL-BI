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
}));

const FolderSubMenu = ({
  addNewDashboard,
  addNewFolder,
  anchorEl,
  deleteFolder,
  directoryObj,
  editFolder,
  root,
  setAnchorEl,
  setAnchorName,
}) => {
  const { blueIcon } = useStyles();

  const closeMenu = () => {
    setAnchorEl(null);
    setAnchorName('');
  };

  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
      <MenuItem
        onClick={() => {
          addNewDashboard(root ? 'root' : directoryObj.name);
          closeMenu();
        }}
      >
        <ListItemIcon className={blueIcon}>
          <InsertChartTwoToneIcon />
        </ListItemIcon>
        <Typography>Create Dashboard</Typography>
      </MenuItem>
      <MenuItem
        onClick={() => {
          addNewFolder(root ? 'root' : directoryObj.name);
          closeMenu();
        }}
      >
        <ListItemIcon>
          <CreateNewFolderTwoToneIcon className={blueIcon} />
        </ListItemIcon>
        <Typography>Create Folder</Typography>
      </MenuItem>
      {!root && (
        <MenuItem
          onClick={() => {
            editFolder(directoryObj);
            closeMenu();
          }}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <Typography>Edit Folder</Typography>
        </MenuItem>
      )}
      {!root && (
        <MenuItem
          onClick={() => {
            deleteFolder(directoryObj);
            closeMenu();
          }}
        >
          <ListItemIcon>
            <CloseIcon />
          </ListItemIcon>
          <Typography>Delete Folder</Typography>
        </MenuItem>
      )}
    </Menu>
  );
};

export default FolderSubMenu;
