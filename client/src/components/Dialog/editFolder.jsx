import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';

// Create styles
const useStyles = makeStyles(() => ({
  formControl: { marginBottom: 24 },
}));

const EditFolderDialog = ({ handleChange, localState, show, toggleDialog, updateFolder }) => {
  const { name } = localState;
  const { formControl } = useStyles();

  return (
    <Dialog onClose={toggleDialog} open={show} fullWidth>
      <DialogTitle>New Folder</DialogTitle>
      <DialogContent>
        <TextField
          className={formControl}
          fullWidth
          label='Folder Name'
          name='name'
          value={name}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button color='secondary' variant='contained' onClick={toggleDialog}>
          Cancel
        </Button>
        <Button color='primary' variant='contained' onClick={updateFolder}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFolderDialog;
