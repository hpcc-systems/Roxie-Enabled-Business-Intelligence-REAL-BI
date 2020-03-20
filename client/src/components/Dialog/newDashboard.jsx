import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

// Redux Actions
import { getClusters } from '../../features/cluster/actions';

// Create styles
const useStyles = makeStyles(() => ({
  close: { padding: '10px 0', width: 16 },
  formControl: { marginBottom: 24 },
  progress: { marginLeft: 10 },
}));

const NewDashboardDialog = ({
  handleChange,
  localState,
  newDashboard,
  newDashboardLoading,
  show,
  toggleDialog,
}) => {
  const { clusterID, name } = localState;
  const { clusters } = useSelector(state => state.cluster);
  const dispatch = useDispatch();
  const { close, formControl, progress } = useStyles();

  // Get list of clusters from database
  useEffect(() => {
    getClusters().then(action => dispatch(action));
  }, [dispatch]);

  return (
    <Dialog onClose={toggleDialog} open={show} fullWidth>
      <Button className={close} onClick={toggleDialog}>
        <CloseIcon />
      </Button>
      <DialogContent>
        <FormControl className={formControl} fullWidth>
          <InputLabel>HPCC Cluster</InputLabel>
          <Select name="clusterID" value={clusterID} onChange={handleChange}>
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
          label="Dashboard Name"
          name="name"
          value={name}
          onChange={handleChange}
          autoComplete="off"
        />
      </DialogContent>
      <DialogActions>
        <Button
          disabled={newDashboardLoading}
          color="primary"
          onClick={newDashboard}
          variant="contained"
        >
          Create Dashboard
          {newDashboardLoading && (
            <CircularProgress className={progress} color="inherit" size={15} />
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewDashboardDialog;
