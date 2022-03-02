import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// React Hooks
import useForm from '../../hooks/useForm';

// React Components
import ShareWorkspace from '../ShareWorkspace';

// Utils
import { shareWorkspace as shareWorkspaceFn } from '../../utils/workspace';
import { getDashboardsFromDirectory } from '../../utils/directory';
import { Alert, AlertTitle } from '@material-ui/lab';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { backgroundColor: theme.palette.info.main, color: theme.palette.info.contrastText },
  dialogContent: { paddingTop: 0 },
}));

const initState = {
  errors: [],
  email: '',
  loading: false,
  successMsg: '',
};

const ShareWorkspaceDialog = ({ show, toggleDialog }) => {
  const { directory, id: workspaceID } = useSelector(state => state.workspace.workspace);
  const { values: localState, handleChange, formFieldsUpdate } = useForm({ ...initState, directory });
  const { button, dialogContent } = useStyles();

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

      formFieldsUpdate({
        loading: false,
        errors: [],
        successMsg: 'Dashboard Shared Successfully',
      });
      setTimeout(() => {
        toggleDialog();
      }, 1500);
    } catch (err) {
      formFieldsUpdate({
        loading: false,
        errors: Array.isArray(err) ? err : [{ msg: err.message }],
      });
    }
  };

  const { errors, loading, successMsg } = localState;
  const msgErr = errors.find(err => err['msg'])?.msg;

  const alertSeverity = msgErr ? 'error' : 'success';
  const alertTitle = msgErr ? 'Error' : 'Success';
  const alertMessage = msgErr || successMsg;

  return (
    <Dialog onClose={toggleDialog} open={show} fullWidth>
      <DialogTitle>Share Dashboard</DialogTitle>
      <DialogContent className={dialogContent}>
        {alertMessage && (
          <Box my={1}>
            <Alert severity={alertSeverity}>
              <AlertTitle>{alertTitle}</AlertTitle>
              {alertMessage}
            </Alert>
          </Box>
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
