import { Grid, Switch, withStyles } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import React from 'react';

const BlueSwitch = withStyles({
  switchBase: {
    color: blue[300],
    '&$checked': {
      color: blue[500],
    },
    '&$checked + $track': {
      backgroundColor: blue[500],
    },
  },
  checked: {},
  track: {},
})(Switch);

function CustomSwitch({ checked, onChange, name }) {
  return (
    <Grid component='label' container alignItems='center' spacing={1}>
      <Grid item>Private</Grid>
      <Grid item>
        <BlueSwitch checked={checked} name={name} onChange={onChange} />
      </Grid>
      <Grid item>Public</Grid>
    </Grid>
  );
}

export default CustomSwitch;
