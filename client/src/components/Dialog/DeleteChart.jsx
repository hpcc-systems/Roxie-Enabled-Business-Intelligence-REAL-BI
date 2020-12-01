import React from 'react';
import { batch, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';

// Redux Actions
import { deleteChart, updateDashboard } from '../../features/dashboard/actions';

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

const DeleteChartDialog = ({ chartID, dashboard, show, toggleDialog }) => {
  const { clusterID, id: dashboardID, name } = dashboard;
  const dispatch = useDispatch();
  const { cancelBtn, deleteBtn } = useStyles();

  const confirmDelete = async () => {
    try {
      const action = await deleteChart(chartID, dashboardID);
      const action2 = await updateDashboard(clusterID, dashboardID, name);

      batch(() => {
        dispatch(action2);
        dispatch(action);
        toggleDialog();
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
