import React from 'react';
import { batch, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';

// Redux Actions
import { closeDashboardInWorkspace, updateWorkspaceDirectory } from '../../features/workspace/actions';

// Utils
import { deleteExistingDashboard } from '../../utils/dashboard';
import { removeObjFromDirectory } from '../../utils/directory';

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
  dialog: { maxWidth: 515 },
}));

const DeleteDashboardDialog = ({ dashboardID, show, toggleDialog, workspace }) => {
  const { directory, directoryDepth, id: workspaceID } = workspace;
  const dispatch = useDispatch();
  const { cancelBtn, deleteBtn, dialog } = useStyles();

  const confirmDelete = async () => {
    const newDirectory = removeObjFromDirectory(directory, dashboardID);
    await deleteExistingDashboard(dashboardID);

    // Update directory and remove dashboard from tab bar, if it was open
    Promise.all([
      updateWorkspaceDirectory(newDirectory, directoryDepth, workspaceID),
      closeDashboardInWorkspace(dashboardID, workspaceID),
    ]).then(actions => {
      batch(() => {
        actions.forEach(action => dispatch(action));
      });
    });

    toggleDialog();
  };

  return (
    <Dialog onClose={toggleDialog} open={show} fullWidth classes={{ paper: dialog }}>
      <DialogTitle>Delete Dashboard?</DialogTitle>
      <DialogContent>
        <Typography>You are about to delete this dashboard. Do you wish to proceed?</Typography>
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

export default DeleteDashboardDialog;
