import React from 'react';
import { Grid } from '@material-ui/core';
import AxisConfigOptions from '../AxisConfigOptions';

const DualAxesParams = props => {
  const { type } = props.localState.configuration;
  const yLabel1 = type === 'dualline' ? 'Y Axis 1' : 'Y Axis 1 (Column)';
  const yLabel2 = type === 'dualline' ? 'Y Axis 2' : 'Y Axis 1 (Line)';

  return (
    <Grid item md={12}>
      <Grid container spacing={2}>
        <AxisConfigOptions {...props} field='axis1' label='X Axis' />
      </Grid>
      <Grid container spacing={2}>
        <AxisConfigOptions {...props} field='axis2' label={yLabel1} />
      </Grid>
      <Grid container spacing={2}>
        <AxisConfigOptions {...props} field='axis3' label={yLabel2} />
      </Grid>
    </Grid>
  );
};

export default DualAxesParams;
