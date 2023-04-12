/* eslint-disable no-unreachable */
import React, { useState } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@material-ui/core';
import CustomSwitch from '../Common/CustomSwitch';

// Redux Actions
import { resetWorkspaceError, updateWorkspace } from '../../features/workspace/actions';

import { useSnackbar } from 'notistack';
import CloseIcon from '@material-ui/icons/Close';

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
  const { id: workspaceID, name, visibility } = workspace;
  const [newWorkspace, setNewWorkspace] = useState({
    name,
    publicWorkspace: visibility === 'private' ? false : true,
  });

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const { button, errMsg, formControl } = useStyles();

  const closeSnackbarButton = key => {
    const onClose = () => closeSnackbar(key);
    return (
      <IconButton onClick={onClose} size='small'>
        <CloseIcon style={{ color: '#ffffff' }} />
      </IconButton>
    );
  };

  const callSnackbar = visibility => {
    enqueueSnackbar(`This workspace is ${visibility} `, {
      variant: 'success',
      action: closeSnackbarButton,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
        preventDuplicate: true,
      },
    });
  };

  const editWorkspace = async () => {
    const { name, publicWorkspace } = newWorkspace;
    try {
      const actions = await updateWorkspace({ workspaceName: name, publicWorkspace }, workspaceID);
      const visibility = newWorkspace.publicWorkspace ? 'public' : 'private';
      callSnackbar(visibility);
      batch(() => {
        actions.forEach(action => dispatch(action));
        toggleDialog();
      });
    } catch (error) {
      dispatch(error);
      setNewWorkspace({
        name: workspace.name,
        publicWorkspace: workspace.visibility === 'private' ? false : true,
      });
      callSnackbar(workspace.visibility);
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
        <Button className={button} variant='contained' onClick={editWorkspace}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditWorkspace;
