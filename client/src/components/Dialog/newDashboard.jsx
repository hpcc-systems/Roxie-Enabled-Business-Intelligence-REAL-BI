import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';

// Redux Actions
import { getClusters } from '../../features/cluster/actions';

// Utils
import { sortArr } from '../../utils/misc';
import { checkForClusterAuth } from '../../utils/clusterAuth';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { backgroundColor: theme.palette.info.main, color: theme.palette.info.contrastText },
  errMsg: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    marginBottom: theme.spacing(1),
  },
  formControl: { marginBottom: 24 },
  progress: { marginRight: 15 },
}));

const NewDashboardDialog = ({ createDashboard, handleChange, loading, localState, show, toggleDialog }) => {
  const { clusterID, error, password, username, hasClusterAuth, name } = localState;
  const { clusters } = useSelector(state => state.cluster);
  const dispatch = useDispatch();
  const { button, errMsg, formControl, progress } = useStyles();

  useEffect(() => {
    // Clear name and cluster ID
    handleChange(null, { name: 'name', value: '' });
    handleChange(null, { name: 'clusterID', value: '' });
    handleChange(null, { name: 'hasClusterAuth', value: null });
    handleChange(null, { name: 'username', value: '' });
    handleChange(null, { name: 'password', value: '' });
    handleChange(null, { name: 'error', value: '' });

    // Get list of clusters
    getClusters().then(action => dispatch(action));
  }, [dispatch, handleChange]);

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
      <DialogTitle>New Dashboard</DialogTitle>
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
        {hasClusterAuth !== null && !hasClusterAuth && (
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
        <Button className={button} variant='contained' disabled={loading} onClick={createDashboard}>
          {loading && <CircularProgress color='inherit' size={20} className={progress} />}
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewDashboardDialog;
