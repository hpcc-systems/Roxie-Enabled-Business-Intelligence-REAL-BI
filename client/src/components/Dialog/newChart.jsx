import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

// Redux Actions
import { addChart } from '../../features/chart/actions';

// React Components
import ChartEditor from '../ChartEditor';

// React Hooks
import useForm from '../../hooks/useForm';

const initState = {
  chartType: 'bar',
  config: {},
  dataset: '',
  datasetObj: {},
  keyword: '',
  params: {},
  query: '',
};

// Create styles
const useStyles = makeStyles(() => ({
  close: { padding: '10px 0', width: 16 },
}));

const NewChartDialog = ({ show, toggleDialog }) => {
  const { values: localState, handleChange, handleChangeObj, resetState } = useForm(initState);
  const { id: dashboardID } = useSelector(state => state.dashboard.dashboard);
  const { charts } = useSelector(state => state.chart);
  const dispatch = useDispatch();
  const { close } = useStyles();

  // Add chart to DB and store
  const newChart = () => {
    const { chartType: type, config: options } = localState;
    const sort = charts.length + 1;
    const newChartObj = { ...localState, dashboardID, options, sort, type };

    addChart(newChartObj).then(action => dispatch(action));

    // Reset and close dialog
    return resetDialog();
  };

  // Reset state and hide dialog
  const resetDialog = () => {
    toggleDialog();
    return resetState(initState);
  };

  return (
    <Dialog open={show} fullWidth maxWidth="xl">
      <Button className={close} onClick={resetDialog}>
        <CloseIcon />
      </Button>
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
