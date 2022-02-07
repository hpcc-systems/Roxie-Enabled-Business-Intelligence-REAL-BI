import React, { Fragment, useEffect } from 'react';
import LoadingSpinner from '../Common/LoadingSpinner';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControlLabel,
  FormHelperText,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Typography,
  TextField,
  MenuItem,
  Checkbox,
  Button,
  Dialog,
  Select,
} from '@material-ui/core';

// Redux Actions
import { getClusters } from '../../features/cluster/actions';

// Utils
import { checkForClusterCreds } from '../../utils/clusterCredentials';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { backgroundColor: theme.palette.info.main, color: theme.palette.info.contrastText },
  formControl: { marginBottom: 15 },
  checkbox: { marginLeft: 0 },
}));

const DashboardDialog = ({
  isEditingDashboard,
  formFieldsUpdate,
  submitDashboard,
  toggleDialog,
  localState,
  show,
}) => {
  const {
    clickedDashboard,
    hasClusterCreds,
    updateCreds,
    clusterID,
    username,
    password,
    loading,
    error,
    name,
  } = localState;

  const cluster = useSelector(state => state.cluster);
  const { clusters, loading: clustersLoading, error: clustersError } = cluster;

  const { button, checkbox, formControl } = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      formFieldsUpdate({ loading: true });
      if (clusterID) {
        try {
          const { hasCreds, isCredsValid } = await checkForClusterCreds(clusterID);
          formFieldsUpdate({
            hasClusterCreds: hasCreds,
            updateCreds: !isCredsValid,
            error:
              hasCreds && !isCredsValid
                ? 'Authentication to HPCC cluster has failed, please check username/password'
                : '',
          });
        } catch (error) {
          formFieldsUpdate({ error: 'Can not check cluster credentials.' });
        }
      }
      formFieldsUpdate({ loading: false });
    })();

    return () => {
      formFieldsUpdate(resetToInitialFields => resetToInitialFields);
    };
  }, []);

  const handleSubmit = () => (isEditingDashboard ? submitDashboard(clickedDashboard) : submitDashboard());
  const handleInputChange = e => formFieldsUpdate({ [e.target.name]: e.target.value });
  const handleCheckboxChange = e => formFieldsUpdate({ updateCreds: e.target.checked });
  const handleSelectCluster = async event => {
    //do not reset all fields because there are properties that you need, like parent id
    try {
      formFieldsUpdate({ loading: true, clusterID: event.target.value });
      const { hasCreds, isCredsValid } = await checkForClusterCreds(event.target.value);
      formFieldsUpdate({
        loading: false,
        hasClusterCreds: hasCreds,
        updateCreds: !isCredsValid,
        error:
          hasCreds && !isCredsValid
            ? 'Authentication to HPCC cluster has failed, please check username/password'
            : '',
      });
    } catch (error) {
      formFieldsUpdate({ loading: false, error: 'Can not check cluster credentials.' });
    }
  };
  const getClustersList = () => {
    dispatch(getClusters());
  };

  const readOnlyUser = isEditingDashboard ? clickedDashboard.permission === 'Read-Only' : false;
  const showUpdateCredsCheckbox = isEditingDashboard && hasClusterCreds && !readOnlyUser;
  const showUsernamePasswordFields = !hasClusterCreds || updateCreds;
  const disableSaveDashboard = loading || name.trim().length === 0 || !clusterID;

  const hpccError =
    error.length > 0 && error !== 'Dashboard with this name already exists, please provide different name';
  const nameError = error === 'Dashboard with this name already exists, please provide different name';

  return (
    <Dialog onClose={toggleDialog} open={show} fullWidth>
      <DialogTitle>{isEditingDashboard ? 'Edit' : 'New'} Dashboard</DialogTitle>
      <DialogContent>
        {readOnlyUser ? (
          <>
            <Typography variant='body1'>Host: {clickedDashboard.cluster?.host}</Typography>
            <Typography variant='body1'>Name: {clickedDashboard.cluster?.name}</Typography>
          </>
        ) : (
          <>
            <FormControl className={formControl} fullWidth error={hpccError || !!clustersError}>
              <InputLabel>HPCC Cluster</InputLabel>
              <Select name='clusterID' value={clusterID || ''} onChange={handleSelectCluster}>
                {clusters.map(({ host, id, infoPort, name }) => {
                  return (
                    <MenuItem key={id} value={id}>
                      {`${name} (${host}:${infoPort})`}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText>{(hpccError && error) || clustersError}</FormHelperText>
            </FormControl>
            <TextField
              error={nameError}
              helperText={nameError && error}
              disabled={loading}
              className={formControl}
              fullWidth
              label='Dashboard Name'
              name='name'
              value={name}
              onChange={handleInputChange}
              autoComplete='off'
            />
          </>
        )}
        {showUpdateCredsCheckbox && (
          <FormControlLabel
            className={checkbox}
            control={
              <Checkbox
                disabled={loading}
                name='updateCreds'
                checked={updateCreds}
                onChange={handleCheckboxChange}
                color='primary'
              />
            }
            label='Update Cluster Credentials'
            labelPlacement='start'
          />
        )}
        {showUsernamePasswordFields && (
          <Fragment>
            <TextField
              error={hpccError}
              helperText={hpccError && 'Invalid username or password'}
              disabled={loading}
              className={formControl}
              fullWidth
              label='HPCC username'
              name='username'
              value={username}
              onChange={handleInputChange}
              autoComplete='off'
            />
            <TextField
              error={hpccError}
              disabled={loading}
              className={formControl}
              fullWidth
              label='HPCC password'
              name='password'
              value={password}
              onChange={handleInputChange}
              autoComplete='new-password'
              type='password'
            />
          </Fragment>
        )}
      </DialogContent>
      <DialogActions>
        {(loading || clustersLoading) && <LoadingSpinner text='Loading...' textStyle='body1' size={20} />}
        {clustersError && (
          <Button className={button} variant='contained' disabled={loading} onClick={getClustersList}>
            Re-fetch clusters list
          </Button>
        )}
        <Button color='secondary' variant='contained' onClick={toggleDialog}>
          Cancel
        </Button>
        <Button className={button} variant='contained' disabled={disableSaveDashboard} onClick={handleSubmit}>
          {isEditingDashboard ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DashboardDialog;
