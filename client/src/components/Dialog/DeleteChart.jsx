import React from 'react';
import { batch, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';

// Redux Actions
import { deleteChart, deleteEmptyFilters, updateAlteredFilters } from '../../features/dashboard/actions';

// Create styles
const useStyles = makeStyles(theme => ({
  cancelBtn: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
  deleteBtn: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.error.contrastText,
  },
}));

const DeleteChartDialog = ({ chartID, dashboard, show, toggleDialog, removeChartLayout }) => {
  const { id: dashboardID, filters } = dashboard;
  const dispatch = useDispatch();
  const { cancelBtn, deleteBtn } = useStyles();

  const confirmDelete = async () => {
    // check if there is settings saved in LS
    const mapViewports = JSON.parse(localStorage.getItem('mapViewports'));
    if (mapViewports?.[chartID]) {
      delete mapViewports[chartID];
      localStorage.setItem(`mapViewports`, JSON.stringify(mapViewports));
    }
    // Remove deleted chart from filter targets
    let updatedFilters = filters.map(({ configuration, id, source }) => {
      const updatedParams = configuration.params.filter(({ targetChart }) => targetChart !== chartID);
      return { id, ...configuration, params: updatedParams, source };
    });
    const emptyFilters = updatedFilters.filter(({ params }) => params.length === 0);
    updatedFilters = updatedFilters.filter(({ params }) => params.length > 0);

    try {
      Promise.all([
        deleteChart(chartID, dashboardID),
        updateAlteredFilters(dashboardID, updatedFilters),
        deleteEmptyFilters(dashboardID, emptyFilters),
      ]).then(async actions => {
        batch(() => {
          actions.forEach(action => dispatch(action));
          removeChartLayout(chartID);
          toggleDialog();
        });
      });
    } catch (error) {
      dispatch(error);
    }
  };

  return (
    <Dialog onClose={toggleDialog} open={show} fullWidth>
      <DialogTitle>Delete Chart?</DialogTitle>
      <DialogContent>
        <Typography>You are about to delete this chart. Do you wish to proceed?</Typography>
      </DialogContent>
      <DialogActions>
        <Button className={cancelBtn} variant='contained' onClick={toggleDialog}>
          Cancel
        </Button>
        <Button className={deleteBtn} variant='contained' onClick={confirmDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteChartDialog;
