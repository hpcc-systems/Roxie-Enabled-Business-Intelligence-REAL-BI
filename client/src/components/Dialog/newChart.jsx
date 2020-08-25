import React, { useEffect, useRef } from 'react';
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
  config: { axis1: {}, axis2: {}, type: 'bar' },
  dataObj: { loading: false },
  dataset: '',
  datasets: [],
  error: '',
  keyword: '',
  mappedParams: [{ name: '', value: '' }],
  sources: [],
  selectedDataset: {},
  selectedSource: {},
  sourceType: 'query',
};

// Create styles
const useStyles = makeStyles(theme => ({
  button: { backgroundColor: theme.palette.info.main, color: theme.palette.info.contrastText },
  toolbar: { padding: 0 },
  typography: { flex: 1, marginLeft: 12 },
}));

const NewChartDialog = ({ show, toggleDialog }) => {
  const { values: localState, handleChange, handleChangeArr, handleChangeObj, handleCheckbox } = useForm(
    initState,
  );
  const eclRef = useRef({});
  const { dashboard } = useSelector(state => state.dashboard);
  const dispatch = useDispatch();
  const { button, toolbar, typography } = useStyles();

  // Reference values
  const {
    dataObj: { loading },
    error,
    selectedDataset = {},
    selectedSource = {},
    sourceType,
  } = localState;
  const sourceKeys = Object.keys(selectedSource).length;
  const datasetKeys = Object.keys(selectedDataset).length;

  useEffect(() => {
    handleChange(null, { name: 'mappedParams', value: [{ name: '', value: '' }] });
  }, [handleChange]);

  // Add components to DB
  const newChart = async () => {
    const { config, dataset } = localState;
    const { isStatic, type } = config;
    const { id: dashboardID } = dashboard;

    if (type === 'textBox' && isStatic) {
      try {
        addChart({ ...config, dataset, ecl: {} }, dashboardID, null, null, null).then(action => {
          dispatch(action);
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      const sourceObj = createSourceObj(localState, eclRef.current);
      const newChartObj = createChartObj(localState, eclRef.current);

      try {
        const { sourceID, sourceName, sourceType } = await addSource(dashboardID, sourceObj);

        addChart(newChartObj, dashboardID, sourceID, sourceName, sourceType).then(action => {
          dispatch(action);
        });
      } catch (err) {
        console.error(err);
      }
    }

    // Close dialog
    return toggleDialog();
  };

  const updateChartPreview = () => {
    const { config, mappedParams, selectedSource: source, sourceType } = localState;
    const { params = [] } = config;

    // Merge param arrays to send to server
    const usedParams = mergeArrays(params, mappedParams);

    if (sourceKeys > 0 && datasetKeys > 0) {
      // Set loading
      handleChange(null, { name: 'dataObj', value: { loading: true } });

      // Fetch data for selectedSource
      getPreviewData(dashboard.clusterID, { params: usedParams, source }, sourceType).then(data => {
        if (typeof data !== 'object') {
          return handleChange(null, { name: 'error', value: data });
        } else if (error !== '') {
          handleChange(null, { name: 'error', value: '' });
        }

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
        {sourceType !== 'ecl' && (
          <Button disabled={sourceKeys === 0 || datasetKeys === 0 || loading} onClick={updateChartPreview}>
            <RefreshIcon />
          </Button>
        )}
      </Toolbar>
      <DialogContent>
        <ChartEditor
          dashboard={dashboard}
          eclRef={eclRef}
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
        <Button variant='contained' className={button} onClick={newChart}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewChartDialog;
