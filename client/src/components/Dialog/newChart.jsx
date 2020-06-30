import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, Toolbar, Typography } from '@material-ui/core';
import { Refresh as RefreshIcon } from '@material-ui/icons';

// Redux Actions
import { addChart } from '../../features/chart/actions';

// React Components
import ChartEditor from '../ChartEditor';

// React Hooks
import useForm from '../../hooks/useForm';

// Utils
import { createChartObj, getPreviewData, mergeArrays } from '../../utils/chart';
import { addSource, createSourceObj } from '../../utils/source';

const initState = {
  chartType: 'bar',
  dataObj: { loading: false },
  dataset: '',
  datasets: [],
  keyword: '',
  mappedParams: [{ name: '', value: '' }],
  options: {},
  params: [],
  sources: [],
  selectedDataset: {},
  selectedSource: {},
  sourceType: 'query',
};

// Create styles
const useStyles = makeStyles(() => ({
  toolbar: { padding: 0 },
  typography: { flex: 1, marginLeft: 12 },
}));

const NewChartDialog = ({ show, toggleDialog }) => {
  const { values: localState, handleChange, handleChangeArr, handleChangeObj, handleCheckbox } = useForm(
    initState,
  );
  const { dashboard } = useSelector(state => state.dashboard);
  const dispatch = useDispatch();
  const { toolbar, typography } = useStyles();

  // Reference values
  const {
    dataObj: { loading },
    selectedDataset = {},
    selectedSource = {},
  } = localState;
  const sourceKeys = Object.keys(selectedSource).length;
  const datasetKeys = Object.keys(selectedDataset).length;

  // Add components to DB
  const newChart = async () => {
    const { id: dashboardID } = dashboard;
    const sourceObj = createSourceObj(localState);
    const newChartObj = createChartObj(localState);

    try {
      const { sourceID, sourceName } = await addSource(dashboardID, sourceObj);

      addChart(newChartObj, dashboardID, sourceID, sourceName).then(action => {
        dispatch(action);
      });
    } catch (err) {
      console.error(err);
    }

    // Close dialog
    return toggleDialog();
  };

  const updateChartPreview = () => {
    const { mappedParams, params, selectedSource: source, sourceType } = localState;

    // Merge param arrays to send to server
    const usedParams = mergeArrays(params, mappedParams);

    if (sourceKeys > 0 && datasetKeys > 0) {
      // Set loading
      handleChange(null, { name: 'dataObj', value: { loading: true } });

      // Fetch data for selectedSource
      getPreviewData(dashboard.clusterID, { params: usedParams, source }, sourceType).then(data => {
        // Set data in local state object with source name as key
        handleChange(null, { name: 'dataObj', value: { data, loading: false } });
      });
    }
  };

  return (
    <Dialog open={show} fullWidth maxWidth='xl'>
      <Toolbar className={toolbar}>
        <Typography variant='h6' color='inherit' className={typography}>
          New Chart
        </Typography>
        <Button disabled={!sourceKeys > 0 || !datasetKeys > 0 || loading} onClick={updateChartPreview}>
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
        <Button color='secondary' onClick={toggleDialog}>
          Cancel
        </Button>
        <Button variant='contained' color='primary' onClick={newChart}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewChartDialog;
