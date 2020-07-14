import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';

// Redux Actions
import { getClusters } from '../../features/cluster/actions';

// Utils
import { checkForClusterAuth } from '../../utils/clusterAuth';
import { sortArr } from '../../utils/misc';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { backgroundColor: theme.palette.info.main, color: theme.palette.info.contrastText },
  checkbox: { marginLeft: 0 },
  errMsg: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    marginBottom: theme.spacing(1),
  },
  formControl: { marginBottom: 24 },
  progress: { marginRight: 15 },
}));

const EditDashboardDialog = ({ handleChange, loading, localState, show, toggleDialog, updateDashboard }) => {
  const { clusterID, error, hasClusterAuth, password, updateCreds, username, name } = localState;
  const { clusters } = useSelector(state => state.cluster);
  const dispatch = useDispatch();
  const { button, errMsg, checkbox, formControl, progress } = useStyles();

  useEffect(() => {
    handleChange(null, { name: 'username', value: '' });
    handleChange(null, { name: 'password', value: '' });
    handleChange(null, { name: 'hasClusterAuth', value: null });
    handleChange(null, { name: 'updateCreds', value: false });
    handleChange(null, { name: 'error', value: '' });

    // Get list of clusters
    getClusters().then(action => dispatch(action));

    // Check for cluster auth already in database
    checkForClusterAuth(clusterID).then(hasAuth => {
      handleChange(null, { name: 'hasClusterAuth', value: hasAuth });
    });
  }, [clusterID, dispatch, handleChange]);

  const handleCheckbox = event => {
    const { checked, name } = event.target;

    handleChange(null, { name: name, value: checked });
  };

  const checkForAuth = async event => {
    // Update cluster ID in local state
    handleChange(event);

    // Check for cluster auth already in database
    let hasAuth = await checkForClusterAuth(event.target.value);

    // Update local state
    handleChange(null, { name: 'hasClusterAuth', value: hasAuth });
  };

  return (
    <Dialog onClose={toggleDialog} open={show} fullWidth>
      <DialogTitle>Edit Dashboard</DialogTitle>
      <DialogContent>
        {error !== '' && (
          <Typography className={errMsg} align='center'>
            {error}
          </Typography>
        )}
        <FormControl className={formControl} fullWidth>
          <InputLabel>HPCC Cluster</InputLabel>
          <Select name='clusterID' value={clusterID} onChange={checkForAuth}>
            {sortArr(clusters, 'id').map(({ host, id, infoPort, name }) => {
              return (
                <MenuItem key={id} value={id}>
                  {`${name} (${host}:${infoPort})`}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <TextField
          className={formControl}
          fullWidth
          label='Dashboard Name'
          name='name'
          value={name}
          onChange={handleChange}
          autoComplete='off'
        />
        {(hasClusterAuth === null || hasClusterAuth) && (
          <FormControlLabel
            className={checkbox}
            control={
              <Checkbox
                name={'updateCreds'}
                checked={updateCreds || false}
                onChange={handleCheckbox}
                color={'primary'}
              />
            }
            label='Update Cluster Credentials'
            labelPlacement='start'
          />
        )}
        {((hasClusterAuth !== null && !hasClusterAuth) || updateCreds) && (
          <Fragment>
            <TextField
              className={formControl}
              fullWidth
              label='Cluster Username'
              name='username'
              value={username}
              onChange={handleChange}
              autoComplete='off'
            />
            <TextField
              className={formControl}
              fullWidth
              label='Cluster Password'
              name='password'
              value={password}
              onChange={handleChange}
              autoComplete='off'
              type='password'
            />
          </Fragment>
        )}
      </DialogContent>
      <DialogActions>
        <Button color='secondary' variant='contained' onClick={toggleDialog}>
          Cancel
        </Button>
        <Button className={button} variant='contained' disabled={loading} onClick={updateDashboard}>
          {loading && <CircularProgress color='inherit' size={20} className={progress} />}
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDashboardDialog;
