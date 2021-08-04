import React from 'react';
import { useHistory } from 'react-router-dom';
import { batch, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';

// Redux Actions
import { deleteWorkspace } from '../../features/workspace/actions';

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
  dialog: { maxWidth: 510 },
}));

const DeleteWorkspace = ({ show, toggleDialog }) => {
  const { workspace } = useSelector(state => state.workspace);
  const { id: workspaceID } = workspace;
  const history = useHistory();
  const dispatch = useDispatch();
  const { cancelBtn, deleteBtn, dialog } = useStyles();

  const confirmDelete = async () => {
    deleteWorkspace(workspaceID)
      .then(actions => {
        batch(() => {
          actions.forEach(action => dispatch(action));
        });
        localStorage.removeItem(`lastViewedDashIndex:${workspaceID}`);
        toggleDialog();
        history.push('/workspace');
      })
      .catch(err => dispatch(err));
  };

  return (
    <Dialog onClose={toggleDialog} open={show} fullWidth classes={{ paper: dialog }}>
      <DialogTitle>Delete Workspace?</DialogTitle>
      <DialogContent>
        <Typography>
          You are about to delete this workspace and <strong>ALL</strong> of its contents. Do you wish to
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

export default DeleteWorkspace;
