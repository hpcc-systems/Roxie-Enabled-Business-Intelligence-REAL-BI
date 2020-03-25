import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';

// Create styles
const useStyles = makeStyles(() => ({
  formControl: { marginBottom: 24 },
}));

const NewFolderDialog = ({ createFolder, handleChange, localState, show, toggleDialog }) => {
  const { name } = localState;
  const { formControl } = useStyles();

  // Clear name
  useEffect(() => {
    handleChange(null, { name: 'name', value: '' });
    handleChange(null, { name: 'clusterID', value: '' });
  }, [handleChange]);

  return (
    <Dialog onClose={toggleDialog} open={show} fullWidth>
      <DialogTitle>New Folder</DialogTitle>
      <DialogContent>
        <TextField
          className={formControl}
          fullWidth
          label="Folder Name"
          name="name"
          value={name}
          onChange={handleChange}
          autoComplete="off"
        />
      </DialogContent>
      <DialogActions>
        <Button color="secondary" variant="contained" onClick={toggleDialog}>
          Cancel
        </Button>
        <Button color="primary" variant="contained" onClick={createFolder}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewFolderDialog;
