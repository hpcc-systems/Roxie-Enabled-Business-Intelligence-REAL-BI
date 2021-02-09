import React from 'react';
import { Grid } from '@material-ui/core';
import AxisConfigOptions from '../AxisConfigOptions';

const GaugeParams = props => {
  return (
    <Grid item md={12}>
      <Grid container spacing={2}>
        <AxisConfigOptions
          {...props}
          field='axis1'
          helperText='Must be in decimal format.'
          label='Percentage'
          showAxisLabelOption={false}
          showDataTypeOption={false}
          showLabelOption={false}
        />
      </Grid>
    </Grid>
  );
};

export default GaugeParams;
