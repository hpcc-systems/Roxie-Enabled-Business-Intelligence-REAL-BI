import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@material-ui/core';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { backgroundColor: theme.palette.info.main, color: theme.palette.info.contrastText },
  errMsg: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    marginBottom: theme.spacing(1),
  },
  formControl: { marginBottom: 24 },
}));

const EditFolderDialog = ({ handleChange, localState, show, toggleDialog, updateFolder }) => {
  const { error, name } = localState;
  const { button, errMsg, formControl } = useStyles();

  // Clear values
  useEffect(() => {
    handleChange(null, { name: 'error', value: '' });
  }, [handleChange]);

  return (
    <Dialog onClose={toggleDialog} open={show} fullWidth>
      <DialogTitle>Edit Folder</DialogTitle>
      <DialogContent>
        {error !== '' && (
          <Typography className={errMsg} align='center'>
            {error}
          </Typography>
        )}
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
        <Button className={button} disabled={name.length === 0} variant='contained' onClick={updateFolder}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFolderDialog;
