import React from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, Toolbar, Typography } from '@material-ui/core';
import { Refresh as RefreshIcon } from '@material-ui/icons';

// Redux Actions
import { getDashboardParams } from '../../features/dashboard/actions';
import { addChart } from '../../features/chart/actions';

// React Components
import ChartEditor from '../ChartEditor';

// React Hooks
import useForm from '../../hooks/useForm';

// Utils
import { createChartObj, getPreviewData } from '../../utils/chart';
import { addQuery, createQueryObj } from '../../utils/query';

const initState = {
  chartType: 'bar',
  dataObj: { loading: false },
  dataset: '',
  datasets: [],
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
  const { values: localState, handleChange, handleChangeArr, handleChangeObj, handleCheckbox } = useForm(
    initState,
  );
  const { dashboard } = useSelector(state => state.dashboard);
  const dispatch = useDispatch();
  const { toolbar, typography } = useStyles();

  // Reference values
  const {
    dataObj: { loading },
    selectedDataset,
    selectedQuery,
  } = localState;
  const queryKeys = Object.keys(selectedQuery).length;
  const datasetKeys = Object.keys(selectedDataset).length;

  // Add components to DB
  const newChart = async () => {
    const { id: dashboardID } = dashboard;
    const queryObj = createQueryObj(localState);
    const newChartObj = createChartObj(localState);

    try {
      const { queryID, queryName } = await addQuery(dashboardID, queryObj);
      const action1 = await addChart(newChartObj, dashboardID, queryID, queryName);
      const action2 = await getDashboardParams(dashboardID);

      // Close dialog
      /*
        Closing the dialog happens here because React will attempt to update the component
        after the actions update the Redux store, causing a memory leak error because the component
        will already be un-mounted.
      */
      // toggleDialog();

      // Batch dispatch each action to only have React re-render once
      batch(() => {
        dispatch(action1);
        dispatch(action2);
      });
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
        <Button disabled={!queryKeys > 0 || !datasetKeys > 0 || loading} onClick={updateChartPreview}>
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
