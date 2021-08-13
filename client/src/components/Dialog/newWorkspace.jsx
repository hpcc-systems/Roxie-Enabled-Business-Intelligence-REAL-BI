import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, batch, useSelector } from 'react-redux';
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

import CustomSwitch from '../Common/CustomSwitch';

// Redux Actions
import { updateLastWorkspace } from '../../features/auth/actions';
import { createNewWorkspace, resetWorkspaceError } from '../../features/workspace/actions';

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
  const { message: errMessage = '' } = useSelector(state => state.workspace.errorObj);
  const [newWorkspace, setNewWorkspace] = useState({ name: '', publicWorkspace: false });
  const dispatch = useDispatch();
  const history = useHistory();
  const { button, errMsg, formControl } = useStyles();

  const createWorkspace = async () => {
    try {
      const { action, workspaceID } = await createNewWorkspace(newWorkspace);
      const action2 = await updateLastWorkspace(workspaceID);

      batch(() => {
        dispatch(action);
        dispatch(action2);
      });

      history.push(`/workspace/${workspaceID}`);
      toggleDialog();
    } catch (error) {
      dispatch(error);
    }
  };

  const closeDialog = () => {
    errMessage !== '' && dispatch(resetWorkspaceError());
    toggleDialog();
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewWorkspace(prevState => ({ ...prevState, [name]: value }));
  };

  const handleWorkspaceVisibility = e => {
    const { name, checked } = e.target;
    setNewWorkspace(prevState => ({ ...prevState, [name]: checked }));
  };

  return (
    <Dialog onClose={closeDialog} open={show} fullWidth>
      <DialogTitle>New Workspace</DialogTitle>
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
          name='name'
          value={newWorkspace.name}
          onChange={handleInputChange}
        />
        <CustomSwitch
          name='publicWorkspace'
          checked={newWorkspace.publicWorkspace}
          onChange={handleWorkspaceVisibility}
        />
      </DialogContent>
      <DialogActions>
        <Button color='secondary' variant='contained' onClick={closeDialog}>
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
