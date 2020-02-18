import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

// Redux Actions
import { updateChart } from '../../../features/chart/actions';

// React Components
import Stepper from './Stepper';
import QueryInfo from './QueryInfo';
import SelectChart from './SelectChart';
import ChartLayout from './ChartLayout';

// React Hooks
import useForm from '../../../hooks/useForm';
import useStepper from '../../../hooks/useStepper';

const initState = {
  chartType: '',
  config: {},
  dashboardID: 0,
  dataset: '',
  fields: [],
  id: 0,
  params: {},
  query: '',
  sort: 0,
};

const steps = ['Choose fields', 'Choose chart type', 'Set chart fields'];

// Create styles
const useStyles = makeStyles(() => ({
  close: { padding: '10px 0', width: 16 },
}));

const EditChartDialog = ({ chartID, show, toggleDialog }) => {
  const {
    values: { chartType, config, dashboardID, dataset, fields, id, params, query, sort },
    handleChange,
    handleChangeObj,
    resetState,
    updateState,
  } = useForm(initState);
  const { step, nextStep, prevStep, resetStep } = useStepper(0);
  const { charts } = useSelector(state => state.chart);
  const dispatch = useDispatch();
  const { close } = useStyles();

  // componentDidMount -> Update local state with values from store
  useEffect(() => {
    const chartIndex = charts.map(({ id }) => id).indexOf(chartID);

    // Confirm that an index was returned
    if (chartIndex > -1) {
      const { type, dashboardID, dataset, id, options, query, sort } = charts[chartIndex];
      const { params, title, xAxis, yAxis } = options;

      const newInitState = {
        chartType: type,
        config: { title, xAxis, yAxis },
        dataset,
        dashboardID,
        id,
        params,
        query,
        sort,
      };

      updateState(newInitState);
    }
  }, [chartID, charts, updateState]);

  // Update chart in DB and store
  const editChart = () => {
    const chartObj = {
      id,
      query,
      dataset,
      type: chartType,
      options: { ...config, params },
      sort,
      dashboardID,
    };

    updateChart(charts, chartObj).then(action => dispatch(action));

    // Reset and close dialog
    return resetDialog();
  };

  // Reset state and hide dialog
  const resetDialog = () => {
    toggleDialog();
    resetStep();
    return resetState(initState);
  };

  return (
    <Dialog open={show} fullWidth>
      <Button className={close} onClick={resetDialog}>
        <CloseIcon />
      </Button>
      <Stepper step={step} steps={steps} />
      <DialogContent>
        {(() => {
          switch (step) {
            case 0:
              return (
                <QueryInfo
                  dataset={dataset}
                  dispatch={dispatch}
                  fields={fields}
                  handleChange={handleChange}
                  handleChangeObj={handleChangeObj}
                  params={params}
                  query={query}
                />
              );
            case 1:
              return <SelectChart chartType={chartType} handleChange={handleChange} />;
            case 2:
              return (
                <ChartLayout
                  chartType={chartType}
                  config={config}
                  fields={fields}
                  handleChange={handleChange}
                  handleChangeObj={handleChangeObj}
                />
              );
            default:
              return 'Unknown step';
          }
        })()}
      </DialogContent>
      <DialogActions>
        <Button disabled={step === 0} color="secondary" onClick={prevStep}>
          Back
        </Button>
        {step === steps.length - 1 ? (
          <Button variant="contained" color="primary" onClick={editChart}>
            Finish
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={nextStep}>
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditChartDialog;
