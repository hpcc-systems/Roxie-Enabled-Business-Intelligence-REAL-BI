import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  // CircularProgress,
  // FormControl,
  Grid,
  // InputLabel,
  // MenuItem,
  // Select,
  TextField,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: { marginTop: theme.spacing(1) },
  progress: { margin: 0, marginTop: 50 },
}));

const StaticFileParams = ({ localState, setParamObj }) => {
  const { params = [] } = localState;
  const { formControl /*progress*/ } = useStyles();

  // Show only certain params
  const partialParamsArr = params.filter(({ name }) => name === 'Start' || name === 'Count');

  return (
    <Grid container direction='row' justify='space-between' spacing={2}>
      {partialParamsArr.map(({ name, type, value }, index) => {
        return (
          <Grid key={index} item xs={12}>
            <TextField
              label={`${name}: ${type}`}
              name='params'
              value={value || ''}
              onChange={event => setParamObj(event, 'value', name)}
              autoComplete='off'
              className={formControl}
              fullWidth
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StaticFileParams;
