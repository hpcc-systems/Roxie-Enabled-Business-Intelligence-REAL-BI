import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

// Redux Actions
import { addChart } from '../../../features/chart/actions';

// React Components
import Stepper from './Stepper';
import SearchQuery from './SearchQuery';
import QueryList from './QueryList';
import QueryInfo from './QueryInfo';
import SelectChart from './SelectChart';
import ChartLayout from './ChartLayout';

// React Hooks
import useForm from '../../../hooks/useForm';
import useStepper from '../../../hooks/useStepper';

const initState = { chartType: '', config: {}, fields: [], keyword: '', params: {}, query: '' };

const steps = [
  'Search query',
  'Select query',
  'Choose fields',
  'Choose chart type',
  'Set chart fields',
];

// Create styles
const useStyles = makeStyles(() => ({
  close: { padding: '10px 0', width: 16 },
}));

const NewChartDialog = ({ show, toggleDialog }) => {
  const {
    values: { chartType, config, fields, keyword, params, query },
    handleChange,
    handleChangeObj,
    resetState,
    setSingleValue,
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
      type: chartType,
      options: JSON.stringify({ ...config, params }),
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
              return (
                <SearchQuery
                  handleChange={handleChange}
                  keyword={keyword}
                  query={query}
                  setSingleValue={setSingleValue}
                />
              );
            case 1:
              return (
                <QueryList
                  dispatch={dispatch}
                  handleChange={handleChange}
                  keyword={keyword}
                  query={query}
                />
              );
            case 2:
              return (
                <QueryInfo
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
