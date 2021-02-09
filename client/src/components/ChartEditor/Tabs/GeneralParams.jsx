import React from 'react';
import { Grid } from '@material-ui/core';
import AxisConfigOptions from '../AxisConfigOptions';

const GeneralChartParams = props => {
  return (
    <Grid item xs={12}>
      <Grid container spacing={2}>
        <AxisConfigOptions {...props} field='axis1' label='X Axis' />
      </Grid>
      <Grid container spacing={2}>
        <AxisConfigOptions {...props} field='axis2' label='Y Axis' />
      </Grid>
    </Grid>
  );
};

export default GeneralChartParams;
