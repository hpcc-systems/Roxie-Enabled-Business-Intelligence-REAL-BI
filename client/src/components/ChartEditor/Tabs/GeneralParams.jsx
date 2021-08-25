import React from 'react';
import { Grid, Paper, Box, Typography } from '@material-ui/core';
import ConfigOptions from '../AxisConfig/ConfigOptions';

const GeneralChartParams = props => {
  return (
    <Grid item xs={12}>
      <Grid container spacing={2}>
        <ConfigOptions {...props} field='axis1' label='X Axis' />
      </Grid>
      <Grid container spacing={2}>
        <ConfigOptions {...props} field='axis2' label='Y Axis' />
      </Grid>

      <Paper>
        <Box p={1}>
          <Typography variant='body1'> Add drill down chart:</Typography>
        </Box>
      </Paper>
    </Grid>
  );
};

export default GeneralChartParams;
