import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

// Redux Actions
import { addChart } from '../../../features/chart/actions';

// React Components
import Stepper from './Stepper';
import QuerySearch from './QuerySearch';
import SelectDataset from './SelectDataset';
import QueryInfo from './QueryInfo';
import SelectChart from './SelectChart';
import ChartLayout from './ChartLayout';

// React Hooks
import useForm from '../../../hooks/useForm';
import useStepper from '../../../hooks/useStepper';

const initState = {
  chartType: '',
  config: {},
  dataset: '',
  fields: [],
  keyword: '',
  params: {},
  query: '',
};

const steps = [
  'Search query',
  'Select dataset',
  'Choose fields',
  'Choose chart type',
  'Set chart options',
];

// Create styles
const useStyles = makeStyles(() => ({
  close: { padding: '10px 0', width: 16 },
}));

const NewChartDialog = ({ show, toggleDialog }) => {
  const {
    values: { chartType, config, dataset, fields, keyword, params, query },
    handleChange,
    handleChangeObj,
    resetState,
  } = useForm(initState);
  const { step, nextStep, prevStep, resetStep } = useStepper(0);
  const { id: dashboardID } = useSelector(state => state.dashboard.dashboard);
  const { charts } = useSelector(state => state.chart);
  const dispatch = useDispatch();
  const { close } = useStyles();

  // Add chart to DB and store
  const newChart = () => {
    const chartObj = {
      query,
      dataset,
      type: chartType,
      options: { ...config, params },
      sort: charts.length + 1,
      dashboardID,
    };

    addChart(chartObj).then(action => dispatch(action));

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
              return <QuerySearch handleChange={handleChange} keyword={keyword} />;
            case 1:
              return (
                <SelectDataset
                  dataset={dataset}
                  dispatch={dispatch}
                  handleChange={handleChange}
                  query={query}
                />
              );
            case 2:
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
            case 3:
              return <SelectChart chartType={chartType} handleChange={handleChange} />;
            case 4:
              return (
                <ChartLayout
                  chartType={chartType}
                  config={config}
                  handleChange={handleChange}
                  fields={fields}
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
          <Button variant="contained" color="primary" onClick={newChart}>
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

export default NewChartDialog;
