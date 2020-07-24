import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, batch } from 'react-redux';
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

// React Hooks
import useForm from '../../hooks/useForm';

// Redux Actions
import { createNewWorkspace, updateLastWorkspace } from '../../features/auth/actions';

const initState = {
  error: '',
  name: '',
};

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

const NewWorkspaceDialog = ({ show, toggleDialog }) => {
  const { values: localState, handleChange } = useForm(initState);
  const dispatch = useDispatch();
  const history = useHistory();
  const { button, errMsg, formControl } = useStyles();

  const createWorkspace = async () => {
    const { action, workspaceID } = await createNewWorkspace(localState);
    const action2 = await updateLastWorkspace(workspaceID);

    batch(() => {
      dispatch(action);
      dispatch(action2);
    });

    history.push(`/workspace/${workspaceID}`);
    toggleDialog();
  };

  const { error, name } = localState;

  return (
    <Dialog onClose={toggleDialog} open={show} fullWidth>
      <DialogTitle>New Workspace</DialogTitle>
      <DialogContent>
        {error !== '' && (
          <Typography className={errMsg} align='center'>
            {error}
          </Typography>
        )}
        <TextField
          className={formControl}
          fullWidth
          label='Workspace Name'
          name='name'
          value={name}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button color='secondary' variant='contained' onClick={toggleDialog}>
          Cancel
        </Button>
        <Button className={button} variant='contained' onClick={createWorkspace}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewWorkspaceDialog;
