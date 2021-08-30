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
import _orderBy from 'lodash/orderBy';

// Redux Actions
import { getClusters } from '../../features/cluster/actions';

// Utils
import { checkForClusterCreds } from '../../utils/clusterCredentials';

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

const EditDashboardDialog = ({
  formFieldsUpdate,
  handleChange,
  loading,
  localState,
  show,
  toggleDialog,
  updateDashboard,
}) => {
  const { clusterID, error, hasClusterCreds, password, updateCreds, username, name } = localState;
  const { clusters } = useSelector(state => state.cluster);
  const dispatch = useDispatch();
  const { button, errMsg, checkbox, formControl, progress } = useStyles();

  useEffect(() => {
    formFieldsUpdate({ username: '', password: '', hasClusterCreds: null, updateCreds: false, error: '' });

    (async () => {
      try {
        const action = await getClusters();
        dispatch(action);
      } catch (error) {
        return dispatch(error);
      }

      try {
        const hasAuth = await checkForClusterCreds(clusterID);
        handleChange(null, { name: 'hasClusterCreds', value: hasAuth });
      } catch (error) {
        return handleChange(null, { name: 'error', value: '' });
      }
    })();
  }, [clusterID, dispatch, handleChange]);

  const handleCheckbox = event => {
    const { checked, name } = event.target;

    handleChange(null, { name: name, value: checked });
  };

  const checkForAuth = async event => {
    try {
      // Update cluster ID in local state
      handleChange(event);

      const hasAuth = await checkForClusterCreds(event.target.value);
      return handleChange(null, { name: 'hasClusterCreds', value: hasAuth });
    } catch (error) {
      dispatch(error);
    }
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
            {_orderBy(clusters, ['name'], ['asc']).map(({ host, id, infoPort, name }) => {
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
        {(hasClusterCreds === null || hasClusterCreds) && (
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
        {((hasClusterCreds !== null && !hasClusterCreds) || updateCreds) && (
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
        <Button
          className={button}
          variant='contained'
          disabled={loading || name.length === 0}
          onClick={updateDashboard}
        >
          {loading && <CircularProgress color='inherit' size={20} className={progress} />}
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDashboardDialog;
