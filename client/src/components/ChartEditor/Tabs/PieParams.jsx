import React from 'react';
import { Grid } from '@material-ui/core';
import AxisConfigOptions from '../AxisConfigOptions';

const PieParams = props => {
  return (
    <Grid item md={12}>
      <Grid container spacing={2}>
        <AxisConfigOptions
          {...props}
          field='axis1'
          label='Name'
          showAxisLabelOption={false}
          showLabelOption={false}
        />
      </Grid>
      <Grid container spacing={2}>
        <AxisConfigOptions
          {...props}
          field='axis2'
          label='Value'
          showAxisLabelOption={false}
          showLabelOption={false}
        />
      </Grid>
    </Grid>
  );
};

export default PieParams;
