import React from 'react';
import { FormControlLabel, Grid, Radio, RadioGroup } from '@material-ui/core';
import { BarChart as BarChartIcon, Timeline as LineChartIcon } from '@material-ui/icons';

const charts = [
  { icon: <BarChartIcon fontSize="large" />, value: 'bar' },
  { icon: <LineChartIcon fontSize="large" />, value: 'line' },
];

const SelectChart = ({ chart, handleChange }) => {
  return (
    <Grid container direction="row" justify="space-evenly" alignItems="center">
      <RadioGroup name="chart" value={chart} onChange={handleChange} row>
        {charts.map(({ icon, value }, index) => {
          return (
            <FormControlLabel
              key={index}
              value={value}
              control={<Radio color="primary" />}
              label={icon}
              labelPlacement="top"
            />
          );
        })}
      </RadioGroup>
    </Grid>
  );
};

export default SelectChart;
