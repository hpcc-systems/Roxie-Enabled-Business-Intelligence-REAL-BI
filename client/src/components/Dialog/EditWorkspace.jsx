import React, { useState } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@material-ui/core';

// Redux Actions
import { updateWorkspace } from '../../features/workspace/actions';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { backgroundColor: theme.palette.info.main, color: theme.palette.info.contrastText },
  errMsg: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    marginBottom: theme.spacing(1),
  },
  formControl: { marginBottom: 24 },
}));

const EditWorkspace = ({ show, toggleDialog }) => {
  const { errorObj, workspace } = useSelector(state => state.workspace);
  const { message: errMessage = '' } = errorObj;
  const { id: workspaceID, name } = workspace;
  const [workspaceName, setWorkspaceName] = useState(name);
  const dispatch = useDispatch();
  const { button, errMsg, formControl } = useStyles();

  const editWorkspace = async () => {
    try {
      const actions = await updateWorkspace(workspaceName, workspaceID);
      batch(() => {
        actions.forEach(action => dispatch(action));
        toggleDialog();
      });
    } catch (error) {
      dispatch(error);
    }
  };

  return (
    <Dialog onClose={toggleDialog} open={show} fullWidth>
      <DialogTitle>Edit Workspace</DialogTitle>
      <DialogContent>
        {errMessage && (
          <Typography className={errMsg} align='center'>
            {errMessage}
          </Typography>
        )}
        <TextField
          className={formControl}
          fullWidth
          label='Workspace Name'
          value={workspaceName}
          onChange={e => setWorkspaceName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button color='secondary' variant='contained' onClick={toggleDialog}>
          Cancel
        </Button>
        <Button className={button} variant='contained' onClick={editWorkspace}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditWorkspace;
