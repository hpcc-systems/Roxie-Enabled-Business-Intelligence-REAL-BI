import React from 'react';
import { Grid } from '@material-ui/core';
import ConfigOptions from '../AxisConfig/ConfigOptions';

const PieParams = props => {
  return (
    <Grid item md={12}>
      <Grid container spacing={2}>
        <ConfigOptions
          {...props}
          field='axis1'
          label='Name'
          showAxisLabelOption={false}
          showLabelOption={false}
        />
      </Grid>
      <Grid container spacing={2}>
        <ConfigOptions
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
