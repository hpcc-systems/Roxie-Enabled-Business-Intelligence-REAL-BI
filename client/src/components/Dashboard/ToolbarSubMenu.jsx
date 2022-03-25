import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core';
import { Close as CloseIcon, Edit as EditIcon, TableChart as TableChartIcon } from '@material-ui/icons';
import useDialog from '../../hooks/useDialog';
import DataSnippetDialog from '../Dialog/DataSnippet';
import { canEditCharts } from '../../utils/misc';

const useStyles = makeStyles(theme => ({
  menuIcon: { minWidth: 35, maxWidth: 35, cursor: 'pointer' },
  outlined: { padding: 0 },
  select: { marginLeft: theme.spacing(1), padding: theme.spacing(1, 0, 1, 1.5) },
}));

const ToolbarSubMenu = ({ permission, anchorEl, chart, setAnchorEl, toggleEdit, removeChart }) => {
  const { id: chartID, sourceID, data } = chart;
  const [dataShow, dataToggle] = useDialog(false);

  const { menuIcon } = useStyles();

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {dataShow && <DataSnippetDialog data={data} show={dataShow} toggleDialog={dataToggle} />}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem
          onClick={() => {
            dataToggle();
            closeMenu();
          }}
        >
          <ListItemIcon className={menuIcon}>
            <TableChartIcon />
          </ListItemIcon>
          <ListItemText>View Data Snippet</ListItemText>
        </MenuItem>
        {canEditCharts(permission) && (
          <>
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
          </>
        )}
      </Menu>
    </>
  );
};

export default ToolbarSubMenu;
