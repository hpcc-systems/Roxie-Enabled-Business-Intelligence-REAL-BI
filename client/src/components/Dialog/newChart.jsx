import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, Toolbar, Typography } from '@material-ui/core';
import { Refresh as RefreshIcon } from '@material-ui/icons';

// Redux Actions
import { createChart } from '../../features/dashboard/actions';

// React Components
import ChartEditor from '../ChartEditor';
import { validateSource } from '../../utils/validate';

// React Hooks
import useForm from '../../hooks/useForm';

// Utils
import { createChartObj, mergeArrays } from '../../utils/chart';
import { createSource, createSourceObj } from '../../utils/source';
import { getChartPreviewData } from '../../utils/hpcc';

const initState = {
  configuration: {
    axis1: { showTickLabels: true },
    axis2: { showTickLabels: true },
    axis3: { showTickLabels: true },
    type: 'bar',
  },
  dataObj: { loading: false },
  dataset: '',
  datasets: [],
  error: '',
  errors: [],
  keyword: '',
  mappedParams: [{ name: '', value: '' }],
  // relations: [{ originField: '', mappedChart: '', mappedField: '' }],
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
    selectedDataset = {},
    selectedSource = {},
    sourceType,
  } = localState;
  const sourceKeys = Object.keys(selectedSource).length;
  const datasetKeys = Object.keys(selectedDataset).length;

  useEffect(() => {
    handleChange(null, { name: 'errors', value: [] });
    handleChange(null, { name: 'mappedParams', value: [{ name: '', value: '' }] });
  }, [handleChange, sourceType]);

  // Add components to DB
  const newChart = async () => {
    const { configuration, dataset } = localState;
    const { isStatic, type } = configuration;
    const { id: dashboardID } = dashboard;
    let sourceID, sourceName, sourceType;

    try {
      validateSource(localState, eclRef);
    } catch (errors) {
      return handleChange(null, { name: 'errors', value: errors });
    }

    if (type === 'textBox' && isStatic) {
      const chartObj = { ...configuration, dataset, ecl: {} };

      try {
        const action = await createChart(chartObj, dashboardID, null, null, null);
        dispatch(action);
      } catch (error) {
        return dispatch(error);
      }
    } else {
      const sourceObj = createSourceObj(localState, eclRef.current);
      const newChartObj = createChartObj(localState, eclRef.current);

      try {
        const newSource = await createSource(sourceObj);
        sourceID = newSource.id;
        sourceName = newSource.name;
        sourceType = newSource.type;
      } catch (error) {
        return handleChange(null, { name: 'error', value: error.message });
      }

      try {
        const action = await createChart(newChartObj, dashboardID, sourceID, sourceName, sourceType);
        dispatch(action);
        return toggleDialog();
      } catch (error) {
        return dispatch(error);
      }
    }
  };

  const updateChartPreview = () => {
    const { configuration, dataset, mappedParams, selectedSource: source, sourceType } = localState;
    const { params = [] } = configuration;

    if (sourceKeys > 0 && datasetKeys > 0) {
      (async () => {
        handleChange(null, { name: 'dataObj', value: { loading: true } });

        try {
          const usedParams = mergeArrays(params, mappedParams);
          const options = { dataset, params: usedParams, source };
          const data = await getChartPreviewData(dashboard.cluster.id, options, sourceType);

          handleChange(null, { name: 'error', value: '' });
          handleChange(null, { name: 'dataObj', value: { data, loading: false } });
        } catch (error) {
          handleChange(null, { name: 'error', value: error.message });
          handleChange(null, { name: 'dataObj', value: { error: error.message, loading: false } });
        }
      })();
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
