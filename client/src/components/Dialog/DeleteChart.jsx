import React from 'react';
import { batch, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';

// Redux Actions
import { getDashboardParams } from '../../features/dashboard/actions';
import { deleteChart } from '../../features/chart/actions';

// Create styles
const useStyles = makeStyles(theme => ({
  cancelBtn: { backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText },
  deleteBtn: { backgroundColor: theme.palette.error.dark, color: theme.palette.error.contrastText },
}));

const DeleteChartDialog = ({ chartID, dashboard, sourceID, show, toggleDialog }) => {
  const { id: dashboardID } = dashboard;
  const dispatch = useDispatch();
  const { cancelBtn, deleteBtn } = useStyles();

  const confirmDelete = async () => {
    let actions = [];

    actions[0] = await deleteChart(chartID, dashboardID, sourceID);
    actions[1] = await getDashboardParams(dashboardID);

    batch(() => {
      dispatch(actions[0]);
      dispatch(actions[1]);
    });

    toggleDialog();
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
