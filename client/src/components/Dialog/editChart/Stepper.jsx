import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Stepper, Step, StepLabel } from '@material-ui/core';

// Create styles
const useStyles = makeStyles(() => ({
  stepper: { margin: '15px 0', padding: 0 },
}));

const QueryStepper = ({ step, steps }) => {
  const { stepper } = useStyles();

  return (
    <Stepper className={stepper} activeStep={step} alternativeLabel>
      {steps.map((label, index) => (
        <Step key={index}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default QueryStepper;
