import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, Toolbar, Typography } from '@material-ui/core';
import { Refresh as RefreshIcon } from '@material-ui/icons';

// Redux Actions
import { updateChart } from '../../features/chart/actions';

// React Components
import ChartEditor from '../ChartEditor';

// React Hooks
import useForm from '../../hooks/useForm';

// Utils
import { createChartObj, getPreviewData, setEditorState } from '../../utils/chart';

// Create styles
const useStyles = makeStyles(() => ({
  close: { padding: '10px 0', width: 16 },
  toolbar: { padding: 0 },
  typography: { flex: 1, marginLeft: 12 },
}));

const EditChartDialog = ({ chartID, show, toggleDialog }) => {
  // Get selected chart
  const { charts } = useSelector(state => state.chart);
  const initState = setEditorState(charts, chartID);

  // Set initial state
  const { values: localState, handleChange, handleChangeArr, handleChangeObj, handleCheckbox } = useForm(
    initState,
  );
  const { dashboard } = useSelector(state => state.dashboard);
  const dispatch = useDispatch();
  const { toolbar, typography } = useStyles();

  // Reference values
  const {
    dataObj: { loading: previewLoading },
    selectedDataset = {},
    selectedSource = {},
  } = localState;
  const sourceKeys = Object.keys(selectedSource).length;
  const datasetKeys = Object.keys(selectedDataset).length;

  // Update chart in DB and store
  const editChart = () => {
    const { chartID, sourceID } = localState;
    const chartObj = createChartObj(localState);

    // Update chart and global params in DB
    updateChart({ id: chartID, ...chartObj }, dashboard.id, sourceID).then(action => {
      // Close dialog
      /*
        Closing the dialog happens here because React will attempt to update the component
        after the action updates the Redux store, causing a memory leak error because the component
        will already be un-mounted.
      */
      toggleDialog();

      return dispatch(action);
    });
  };

  const updateChartPreview = () => {
    const { params, selectedSource, sourceType } = localState;

    if (sourceKeys > 0 && datasetKeys > 0) {
      // Set loading
      handleChange(null, { name: 'dataObj', value: { loading: true } });

      // Fetch data for selectedSource
      getPreviewData(dashboard.clusterID, { params, source: selectedSource }, sourceType).then(data => {
        // Set data in local state object with source name as key
        handleChange(null, { name: 'dataObj', value: { data, loading: false } });
      });
    }
  };

  return (
    <Dialog open={show} fullWidth maxWidth='xl'>
      <Toolbar className={toolbar}>
        <Typography variant='h6' color='inherit' className={typography}>
          Edit Chart
        </Typography>
        <Button disabled={!sourceKeys > 0 || !datasetKeys > 0 || previewLoading} onClick={updateChartPreview}>
          <RefreshIcon />
        </Button>
      </Toolbar>
      <DialogContent>
        <ChartEditor
          dashboard={dashboard}
          handleChange={handleChange}
          handleChangeArr={handleChangeArr}
          handleChangeObj={handleChangeObj}
          handleCheckbox={handleCheckbox}
          localState={localState}
        />
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='secondary' onClick={toggleDialog}>
          Cancel
        </Button>
        <Button variant='contained' color='primary' onClick={editChart}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditChartDialog;
