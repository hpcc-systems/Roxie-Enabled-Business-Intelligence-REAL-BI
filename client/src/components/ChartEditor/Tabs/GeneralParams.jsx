import React from 'react';
import { Grid } from '@material-ui/core';

import ConfigOptions from '../AxisConfig/ConfigOptions';
import DrillDownParams from './DrillDownParams';

const GeneralChartParams = props => {
  const isAllowedToDrillDown =
    props.localState.configuration?.drillDown && props.localState.configuration?.type === 'bar';

  return (
    <Grid item xs={12}>
      <Grid container spacing={2}>
        <ConfigOptions {...props} field='axis1' label='X Axis' />
      </Grid>
      <Grid container spacing={2}>
        <ConfigOptions {...props} field='axis2' label='Y Axis' />
      </Grid>
      {isAllowedToDrillDown && <DrillDownParams {...props} />}
    </Grid>
  );
};

export default GeneralChartParams;
