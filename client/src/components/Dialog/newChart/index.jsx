import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import {
  // BarChart as BarChartIcon,
  Close as CloseIcon,
  // Timeline as TimelineIcon,
  // PieChart as PieChartIcon,
} from '@material-ui/icons';

// React Components
import Stepper from './Stepper';
import SearchQuery from './SearchQuery';
import QueryList from './QueryList';
import QueryInfo from './QueryInfo';

// React Hooks
import useForm from '../../../hooks/useForm';
import useStepper from '../../../hooks/useStepper';

const initState = { fields: [], keyword: '', query: '' };

const steps = [
  'Search query',
  'Select query',
  'Choose fields',
  'Choose chart type',
  'Set chart fields',
];

// const charts = [
//   { icon: <BarChartIcon fontSize="large" />, value: 'bar' },
//   { icon: <TimelineIcon fontSize="large" />, value: 'line' },
//   { icon: <PieChartIcon fontSize="large" />, value: 'pie' },
// ];

const useStyles = makeStyles(() => ({
  close: { padding: '10px 0', width: 16 },
}));

const NewChartDialog = ({ show, toggleDialog }) => {
  const {
    values: { fields, keyword, query },
    handleChange,
    resetState,
  } = useForm(initState);
  const { step, nextStep, prevStep } = useStepper(0);
  const dispatch = useDispatch();
  const { close } = useStyles();

  // Reset state and hide dialog
  const resetDialog = () => {
    toggleDialog();
    return resetState(initState);
  };

  return (
    <Dialog onClose={resetDialog} open={show} fullWidth>
      <Button className={close} onClick={resetDialog}>
        <CloseIcon />
      </Button>
      <Stepper step={step} steps={steps} />
      <DialogContent>
        {(() => {
          switch (step) {
            case 0:
              return <SearchQuery handleChange={handleChange} keyword={keyword} />;
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
                  query={query}
                />
              );
            default:
              return 'Unknown step';
          }
        })()}
      </DialogContent>
      <DialogActions>
        <Button disabled={step === 0} color="primary" onClick={prevStep}>
          Back
        </Button>
        {step === steps.length - 1 ? (
          <Button variant="contained" color="primary">
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
