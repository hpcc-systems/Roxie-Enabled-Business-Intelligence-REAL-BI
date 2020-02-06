import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
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
}));

const NewDashboardDialog = ({
  clusterID,
  dispatch,
  handleChange,
  name,
  newDashboard,
  resetDialog,
  show,
}) => {
  const { clusters } = useSelector(state => state.cluster);
  const { close, formControl } = useStyles();

  // ComponentDidMount -> Get list of clusters from database
  useEffect(() => {
    getClusters().then(action => dispatch(action));
  }, [dispatch]);

  return (
    <Dialog onClose={resetDialog} open={show} fullWidth>
      <Button className={close} onClick={resetDialog}>
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
        <Button color="primary" onClick={newDashboard} variant="contained">
          Create Dashboard
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewDashboardDialog;
