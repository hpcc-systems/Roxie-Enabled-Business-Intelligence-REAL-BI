import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// React Components
import DataTable from '../DataTable';

// Create styles
const useStyles = makeStyles(() => ({
  paper: {
    maxHeight: '80vh',
    maxWidth: '80vw',
    minHeight: '75vh',
  },
}));

const SnippetDialog = ({ data, show, toggleDialog }) => {
  const { paper } = useStyles();

  return (
    <Dialog onClose={toggleDialog} open={show} classes={{ paper }}>
      <DialogTitle>Data Snippet Preview</DialogTitle>
      <DialogContent>
        <DataTable data={data} />
      </DialogContent>
    </Dialog>
  );
};

export default SnippetDialog;
