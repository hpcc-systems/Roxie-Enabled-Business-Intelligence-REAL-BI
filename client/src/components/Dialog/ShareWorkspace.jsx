import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

// React Hooks
import useForm from '../../hooks/useForm';

// React Components
import ShareWorkspace from '../ShareWorkspace';

// Utils
import { shareWorkspace as shareWorkspaceFn } from '../../utils/workspace';
import { getDashboardsFromDirectory } from '../../utils/directory';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { backgroundColor: theme.palette.info.main, color: theme.palette.info.contrastText },
  dialogContent: { paddingTop: 0 },
  errMsg: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  message: {
    borderRadius: 4,
    marginBottom: theme.spacing(2),
    padding: theme.spacing(0.5),
  },
  success: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
}));

const initState = {
  errors: [],
  email: '',
  loading: false,
  successMsg: '',
};

const ShareWorkspaceDialog = ({ show, toggleDialog }) => {
  const { directory, id: workspaceID } = useSelector(state => state.workspace.workspace);
  const { values: localState, handleChange } = useForm({ ...initState, directory });
  const { button, dialogContent, errMsg, message, success } = useStyles();

  const handleSubmit = async () => {
    const { directory: stateDirectory, email } = localState;

    // Split emails into array and sanitize any leading or trailing spaces
    const emailArr = email.split(';').map(addr => addr.trim());

    if (emailArr[0] === '') {
      return handleChange(null, { name: 'errors', value: [{ email: 'Required Field' }] });
    }

    const dashboards = getDashboardsFromDirectory(stateDirectory, []);
    const sharedDashboards = dashboards.filter(({ shared }) => shared).map(({ id }) => id);

    if (sharedDashboards.length === 0) {
      return handleChange(null, { name: 'errors', value: [{ msg: 'Must select at least one dashboard' }] });
    }

    handleChange(null, { name: 'loading', value: true });

    try {
      await shareWorkspaceFn(workspaceID, emailArr, stateDirectory, sharedDashboards);
    } catch (err) {
      handleChange(null, { name: 'loading', value: false });

      if (Array.isArray(err)) {
        return handleChange(null, { name: 'errors', value: err });
      }

      return handleChange(null, { name: 'errors', value: [{ msg: err.message }] });
    }

    handleChange(null, { name: 'loading', value: false });
    handleChange(null, { name: 'errors', value: [] });
    handleChange(null, { name: 'successMsg', value: 'Workspace Shared Successfully' });
    setTimeout(() => toggleDialog(), 1500); // Wait 1.5 seconds then close dialog
  };

  const { errors, loading, successMsg } = localState;
  const msgErr = errors.find(err => err['msg'])?.msg;

  return (
    <Dialog onClose={toggleDialog} open={show} fullWidth>
      <DialogTitle>Share Workspace</DialogTitle>
      <DialogContent className={dialogContent}>
        {msgErr !== undefined && (
          <Typography className={classnames(message, errMsg)} align='center'>
            {msgErr}
          </Typography>
        )}
        {successMsg && (
          <Typography className={classnames(message, success)} align='center'>
            {successMsg}
          </Typography>
        )}

        <ShareWorkspace localState={localState} handleChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button color='secondary' variant='contained' onClick={toggleDialog} disabled={loading}>
          Cancel
        </Button>
        <Button className={button} variant='contained' onClick={handleSubmit} disabled={loading}>
          Share
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareWorkspaceDialog;
