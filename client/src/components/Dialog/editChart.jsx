import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

// Redux Actions
import { updateChart } from '../../features/chart/actions';

// React Components
import ChartEditor from '../ChartEditor';

// React Hooks
import useForm from '../../hooks/useForm';

// Create styles
const useStyles = makeStyles(() => ({
  close: { padding: '10px 0', width: 16 },
}));

const EditChartDialog = ({ chartID, show, toggleDialog }) => {
  // Get selected chart
  const { charts } = useSelector(state => state.chart);
  const chartIndex = charts.map(({ id }) => id).indexOf(chartID);

  // Create initial state object
  const { type: chartType, options: config, ...otherVals } = charts[chartIndex];
  const initState = { chartType, config, datasetObj: {}, ...otherVals };

  // Set initial state
  const { values: localState, handleChange, handleChangeObj, resetState } = useForm(initState);
  const dispatch = useDispatch();
  const { close } = useStyles();

  // Update chart in DB and store
  const editChart = () => {
    const { chartType: type, config: options, id, params } = localState;
    const chartObj = { id, params, type, options };

    updateChart(charts, chartObj).then(action => dispatch(action));

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
        <Button variant="contained" color="primary" onClick={editChart}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditChartDialog;
