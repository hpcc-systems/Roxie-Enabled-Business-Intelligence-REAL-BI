import React from 'react';
import { batch, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';

// Redux Actions
import { closeMultipleOpenDashboards, updateWorkspaceDirectory } from '../../features/workspace/actions';

// Utils
import { getDashboardIDsFromFolder, removeObjFromDirectory } from '../../utils/directory';
import { deleteMultipleExistingDashboard } from '../../utils/dashboard';

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
  dialog: { maxWidth: 490 },
}));

const DeleteFolderDialog = ({ directoryObj, show, toggleDialog, workspace }) => {
  const { directory, id: workspaceID } = workspace;
  const dispatch = useDispatch();
  const { cancelBtn, deleteBtn, dialog } = useStyles();

  const confirmDelete = async () => {
    try {
      const dashboardIDArray = getDashboardIDsFromFolder(directoryObj, []);
      const newDirectory = removeObjFromDirectory(directory, directoryObj.id);
      await deleteMultipleExistingDashboard(dashboardIDArray);

      const actions = await Promise.all([
        closeMultipleOpenDashboards(dashboardIDArray, workspaceID),
        updateWorkspaceDirectory(newDirectory, workspaceID),
      ]);

      batch(() => actions.forEach(action => dispatch(action)));
      toggleDialog();
    } catch (error) {
      dispatch(error);
    }
  };

  return (
    <Dialog onClose={toggleDialog} open={show} fullWidth classes={{ paper: dialog }}>
      <DialogTitle>Delete Folder?</DialogTitle>
      <DialogContent>
        <Typography>
          You are about to delete this folder and <strong>ALL</strong> of its contents. Do you wish to
          proceed?
        </Typography>
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

export default DeleteFolderDialog;
