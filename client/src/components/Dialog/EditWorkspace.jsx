import React, { useState } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

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

const BlueSwitch = withStyles({
  switchBase: {
    color: blue[300],
    '&$checked': {
      color: blue[500],
    },
    '&$checked + $track': {
      backgroundColor: blue[500],
    },
  },
  checked: {},
  track: {},
})(Switch);

const EditWorkspace = ({ show, toggleDialog }) => {
  const { errorObj, workspace } = useSelector(state => state.workspace);
  const { message: errMessage = '' } = errorObj;
  const { id: workspaceID, name } = workspace;
  const [workspaceName, setWorkspaceName] = useState(name);
  const [publicWorkspace, setPublicWorkspace] = React.useState(false);

  React.useEffect(() => {
    if (workspace?.visibility) {
      const publicWorkspace = workspace.visibility === 'private' ? false : true;
      setPublicWorkspace(publicWorkspace);
    }
  }, [workspace]);

  const handleWorkspaceVisibility = event => {
    setPublicWorkspace(event.target.checked);
  };

  const dispatch = useDispatch();
  const { button, errMsg, formControl } = useStyles();

  const editWorkspace = async () => {
    try {
      const actions = await updateWorkspace({ workspaceName, publicWorkspace }, workspaceID);
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

        <Grid component='label' container alignItems='center' spacing={1}>
          <Grid item>Private</Grid>
          <Grid item>
            <BlueSwitch checked={publicWorkspace} onChange={handleWorkspaceVisibility} />
          </Grid>
          <Grid item>Public</Grid>
        </Grid>
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
