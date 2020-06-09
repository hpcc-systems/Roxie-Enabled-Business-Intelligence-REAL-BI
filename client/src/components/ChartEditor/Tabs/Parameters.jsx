import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, Grid, TextField, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: { marginTop: theme.spacing(1) },
  progress: { margin: 0, marginTop: 50 },
  typography: { marginTop: 20 },
}));

const ParametersTab = ({ handleChangeArr, localState }) => {
  const { dataset, params = [] } = localState;
  const { formControl, typography } = useStyles();

  // Updates param array in state
  const setParamObj = (event, field, index) => {
    const arr = params;
    const { name, value } = event.target;

    // Get param object at index and update it
    const indexObj = params[index];
    const newObj = { ...indexObj, [field]: value };

    // Replace object in array
    arr[index] = newObj;

    handleChangeArr(name, arr);
  };

  return dataset ? (
    <FormControl className={formControl} fullWidth>
      {params.length > 0 ? (
        <Grid container direction='row' justify='space-between' spacing={2}>
          {params.map(({ name, type }, index) => {
            return (
              <Grid key={index} item xs={12}>
                <TextField
                  label={`${name}: ${type}`}
                  name='params'
                  value={params[index].value || ''}
                  onChange={event => setParamObj(event, 'value', index)}
                  autoComplete='off'
                  className={formControl}
                  fullWidth
                />
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Typography variant='h6' color='inherit' align='center' className={typography}>
          No Parameters
        </Typography>
      )}
    </FormControl>
  ) : (
    <Typography variant='h6' color='inherit' align='center' className={typography}>
      Choose a dataset
    </Typography>
  );
};

export default ParametersTab;
