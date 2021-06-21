import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ListItemIcon, ListItemText, Menu, MenuItem, Select } from '@material-ui/core';
import { Close as CloseIcon, Edit as EditIcon, TableChart as TableChartIcon } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  menuIcon: { minWidth: 35, maxWidth: 35, cursor: 'pointer' },
  outlined: { padding: 0 },
  select: { marginLeft: theme.spacing(1), padding: theme.spacing(1, 0, 1, 1.5) },
}));

const ToolbarSubMenu = ({ anchorEl, chart, setAnchorEl, toggleData, toggleEdit, removeChart }) => {
  const { id: chartID, sourceID } = chart;

  const { menuIcon } = useStyles();

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
      <MenuItem
        onClick={() => {
          toggleData(chartID);
          closeMenu();
        }}
      >
        <ListItemIcon className={menuIcon}>
          <TableChartIcon />
        </ListItemIcon>
        <ListItemText>View Data Snippet</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          toggleEdit(chartID);
          closeMenu();
        }}
      >
        <ListItemIcon className={menuIcon}>
          <EditIcon />
        </ListItemIcon>
        <ListItemText>Edit Chart</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          removeChart(chartID, sourceID);
          closeMenu();
        }}
      >
        <ListItemIcon className={menuIcon}>
          <CloseIcon />
        </ListItemIcon>
        <ListItemText>Delete Chart</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default ToolbarSubMenu;
