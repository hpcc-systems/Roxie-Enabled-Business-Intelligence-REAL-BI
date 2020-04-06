import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';

// Redux Actions
import { getClusters } from '../../features/cluster/actions';

// Create styles
const useStyles = makeStyles(() => ({
  formControl: { marginBottom: 24 },
}));

const NewDashboardDialog = ({ createDashboard, handleChange, localState, show, toggleDialog }) => {
  const { clusterID, name } = localState;
  const { clusters } = useSelector(state => state.cluster);
  const dispatch = useDispatch();
  const { formControl } = useStyles();

  // Get list of clusters from database
  useEffect(() => {
    getClusters().then(action => dispatch(action));
  }, [dispatch]);

  // Clear name
  useEffect(() => {
    handleChange(null, { name: 'name', value: '' });
    handleChange(null, { name: 'clusterID', value: '' });
  }, [handleChange]);

  return (
    <Dialog onClose={toggleDialog} open={show} fullWidth>
      <DialogTitle>New Dashboard</DialogTitle>
      <DialogContent>
        <FormControl className={formControl} fullWidth>
          <InputLabel>HPCC Cluster</InputLabel>
          <Select name='clusterID' value={clusterID} onChange={handleChange}>
            {clusters.map(({ host, id, infoPort, name }) => {
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
      </DialogContent>
      <DialogActions>
        <Button color='secondary' variant='contained' onClick={toggleDialog}>
          Cancel
        </Button>
        <Button color='primary' variant='contained' onClick={createDashboard}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewDashboardDialog;
