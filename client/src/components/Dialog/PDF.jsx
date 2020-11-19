import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent, Paper, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

// React Components
import PdfEditor from '../PDFEditor';
import PdfPreview from '../PDFEditor/PdfPreview';

// React Hooks
import useForm from '../../hooks/useForm';

// Utils
import { printDashboard } from '../../utils/pdf';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { backgroundColor: theme.palette.info.main, color: theme.palette.info.contrastText },
  dialog: { maxHeight: '70vh', maxWidth: '70vw' },
  paper: { backgroundColor: grey[300], padding: theme.spacing(2, 0) },
  toolbar: { padding: 0 },
  typography: { flex: 1, margin: theme.spacing(2, 1.5) },
}));

const initState = {
  fileName: 'dashboard',
  headerImg: '',
  headerURI: '',
  orientation: 'portrait',
};

const PdfDialog = ({ compData, show, toggleDialog }) => {
  const { dashboard } = useSelector(state => state.dashboard);
  const { values: localState, handleChange } = useForm(initState);
  const { charts } = dashboard;
  const { button, dialog, paper, toolbar, typography } = useStyles();

  const createPDF = async () => {
    try {
      await printDashboard(localState);
      toggleDialog();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={show} fullWidth classes={{ paper: dialog }}>
      <Toolbar className={toolbar}>
        <Typography variant='h6' color='inherit' className={typography}>
          Create Dashboard PDF
        </Typography>
      </Toolbar>
      <DialogContent>
        <PdfEditor handleChange={handleChange} localState={localState} />
        <Paper variant='outlined' className={paper}>
          <PdfPreview charts={charts} compData={compData} dashboard={dashboard} localState={localState} />
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='secondary' onClick={toggleDialog}>
          Cancel
        </Button>
        <Button variant='contained' className={button} onClick={createPDF}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PdfDialog;
