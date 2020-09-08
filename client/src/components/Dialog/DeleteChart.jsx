import React from 'react';
import { batch, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';

// Redux Actions
import { getDashboardParams, updateDashboard } from '../../features/dashboard/actions';
import { deleteChart } from '../../features/chart/actions';

// Utils
import { deleteRelations } from '../../utils/dashboard';

// Create styles
const useStyles = makeStyles(theme => ({
  cancelBtn: { backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText },
  deleteBtn: { backgroundColor: theme.palette.error.dark, color: theme.palette.error.contrastText },
}));

const DeleteChartDialog = ({ chartID, dashboard, sourceID, show, toggleDialog }) => {
  const { id: dashboardID, relations } = dashboard;
  const dispatch = useDispatch();
  const { cancelBtn, deleteBtn } = useStyles();

  const confirmDelete = async () => {
    let actions = [];

    const newRelations = deleteRelations(relations || {}, chartID);

    actions[0] = await deleteChart(chartID, dashboardID, sourceID);
    actions[1] = await getDashboardParams(dashboardID);
    actions[2] = await updateDashboard({ ...dashboard, relations: newRelations });

    batch(() => {
      actions.forEach(action => dispatch(action));
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
