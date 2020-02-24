import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, Toolbar } from '@material-ui/core';
import { Close as CloseIcon, Refresh as RefreshIcon } from '@material-ui/icons';

// Redux Actions
import { addChart } from '../../features/chart/actions';

// React Components
import ChartEditor from '../ChartEditor';

// React Hooks
import useForm from '../../hooks/useForm';

// Utils
import { getPreviewData } from '../../utils/chart';

const initState = {
  chartType: 'bar',
  config: {},
  dataObj: { loading: false },
  dataset: '',
  datasetObj: {},
  groupBy: {},
  keyword: '',
  params: {},
  query: '',
};

// Create styles
const useStyles = makeStyles(() => ({
  close: { padding: '10px 0', width: 16 },
  div: { flex: 1 },
  toolbar: { padding: 0 },
}));

const NewChartDialog = ({ show, toggleDialog }) => {
  const { values: localState, handleChange, handleChangeObj, resetState } = useForm(initState);
  const { clusterID, id: dashboardID } = useSelector(state => state.dashboard.dashboard);
  const { charts } = useSelector(state => state.chart);
  const dispatch = useDispatch();
  const { close, div, toolbar } = useStyles();

  // Add chart to DB and store
  const newChart = () => {
    const { chartType: type, config, dataset, groupBy, params, query } = localState;
    const newChartObj = {
      dashboardID,
      dataset,
      options: { ...config, groupBy },
      params,
      query,
      sort: charts.length + 1,
      type,
    };

    addChart(newChartObj).then(action => dispatch(action));

    // Reset and close dialog
    return resetDialog();
  };

  // Reset state and hide dialog
  const resetDialog = () => {
    toggleDialog();
    return resetState(initState);
  };

  const updateChartPreview = () => {
    const { params, query } = localState;

    // Fetch data for query
    getPreviewData({ params, query }, clusterID).then(data => {
      // Set data in local state object with query name as key
      handleChange({ target: { name: 'dataObj', value: { data, loading: false } } });
    });
  };

  return (
    <Dialog open={show} fullWidth maxWidth="xl">
      <Toolbar className={toolbar}>
        <div className={div}>
          <Button className={close} onClick={resetDialog}>
            <CloseIcon />
          </Button>
        </div>
        <Button onClick={updateChartPreview}>
          <RefreshIcon />
        </Button>
      </Toolbar>
      <DialogContent>
        <ChartEditor
          dispatch={dispatch}
          handleChange={handleChange}
          handleChangeObj={handleChangeObj}
          localState={localState}
        />
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={resetDialog}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={newChart}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewChartDialog;
