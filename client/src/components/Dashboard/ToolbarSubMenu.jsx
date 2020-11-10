import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ListItemIcon, ListItemText, Menu, MenuItem, Select } from '@material-ui/core';
import { Close as CloseIcon, Edit as EditIcon } from '@material-ui/icons';

// Constants
import { chartSizes } from '../../constants';

const useStyles = makeStyles(theme => ({
  menuIcon: { minWidth: 35, maxWidth: 35 },
  outlined: { padding: 0 },
  select: { marginLeft: theme.spacing(1), padding: theme.spacing(1, 0, 1, 1.5) },
}));

const ToolbarSubMenu = ({ anchorEl, chart, setAnchorEl, toggleDialog, removeChart, updateChartWidth }) => {
  const { configuration, id: chartID, sourceID } = chart;
  const { size = 12 } = configuration;
  const { menuIcon } = useStyles();
  const { outlined, select } = useStyles();

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
      <MenuItem>
        <ListItemText>Chart Width:</ListItemText>
        <Select
          autoWidth
          className={select}
          variant='outlined'
          classes={{ outlined }}
          value={size || 12}
          onChange={event => {
            updateChartWidth(event, chart);
            closeMenu();
          }}
        >
          {chartSizes.map(({ label, value }, index) => {
            return (
              <MenuItem key={index} value={value}>
                {label}
              </MenuItem>
            );
          })}
        </Select>
      </MenuItem>
      <MenuItem
        onClick={() => {
          toggleDialog(chartID);
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
