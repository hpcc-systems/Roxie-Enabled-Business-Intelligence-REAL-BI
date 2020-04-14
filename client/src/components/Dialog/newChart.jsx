import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, Toolbar, Typography } from '@material-ui/core';
import { Refresh as RefreshIcon } from '@material-ui/icons';

// Redux Actions
import { getDashboardParams } from '../../features/dashboard/actions';
import { addQuery } from '../../features/query/actions';
import { addChart } from '../../features/chart/actions';

// React Components
import ChartEditor from '../ChartEditor';

// React Hooks
import useForm from '../../hooks/useForm';

// Utils
import { createChartObj, getPreviewData } from '../../utils/chart';
import { createQueryObj } from '../../utils/query';

const initState = {
  chartType: 'bar',
  dataObj: { loading: false },
  dataset: '',
  datasets: [],
  groupBy: '',
  keyword: '',
  options: {},
  params: [],
  queries: [],
  selectedDataset: {},
  selectedQuery: {},
};

// Create styles
const useStyles = makeStyles(() => ({
  toolbar: { padding: 0 },
  typography: { flex: 1, marginLeft: 12 },
}));

const NewChartDialog = ({ show, toggleDialog }) => {
  const { values: localState, handleChange, handleChangeArr, handleChangeObj } = useForm(initState);
  const { dashboard } = useSelector(state => state.dashboard);
  const { charts } = useSelector(state => state.chart);
  const dispatch = useDispatch();
  const { toolbar, typography } = useStyles();

  // Reference values
  const {
    dataObj: { loading: previewLoading },
    selectedDataset,
    selectedQuery,
  } = localState;
  const queryKeys = Object.keys(selectedQuery).length;
  const datasetKeys = Object.keys(selectedDataset).length;

  // Add components to DB
  const newChart = async () => {
    const { id: dashboardID } = dashboard;
    const queryObj = createQueryObj(localState);
    const newChartObj = createChartObj(localState, charts.length + 1);

    try {
      const { action: action1, queryID, queryName } = await addQuery(dashboardID, queryObj);
      const action2 = await addChart(newChartObj, dashboardID, queryID, queryName);
      const action3 = await getDashboardParams(dashboardID);

      // Dispatch each action
      [action1, action2, action3].forEach(action => dispatch(action));
    } catch (err) {
      console.error(err);
    }

    // Close dialog
    return toggleDialog();
  };

  const updateChartPreview = () => {
    const { params, selectedQuery } = localState;

    if (queryKeys > 0 && datasetKeys > 0) {
      // Set loading
      handleChange(null, { name: 'dataObj', value: { loading: true } });

      // Fetch data for selectedQuery
      getPreviewData(dashboard.clusterID, { params, query: selectedQuery }).then(data => {
        // Set data in local state object with query name as key
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
        <Button disabled={!queryKeys > 0 || !datasetKeys > 0 || previewLoading} onClick={updateChartPreview}>
          <RefreshIcon />
        </Button>
      </Toolbar>
      <DialogContent>
        <ChartEditor
          dashboard={dashboard}
          handleChange={handleChange}
          handleChangeArr={handleChangeArr}
          handleChangeObj={handleChangeObj}
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
