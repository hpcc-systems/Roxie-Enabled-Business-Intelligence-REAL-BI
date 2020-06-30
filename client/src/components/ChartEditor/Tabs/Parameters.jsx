import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, Grid, TextField, Typography } from '@material-ui/core';

// React Components
import { DynamicFileParams, StaticFileParams } from './FileParams';

const useStyles = makeStyles(theme => ({
  formControl: { marginTop: theme.spacing(1) },
  progress: { margin: 0, marginTop: 50 },
  typography: { marginTop: 20 },
}));

// Changes message based on source type
const getMsg = sourceType => {
  return sourceType === 'file' ? 'Choose a file' : 'Choose a dataset';
};

const ParametersTab = ({ handleChangeArr, localState }) => {
  const { dataset, params = [], sourceType } = localState;
  const { formControl, typography } = useStyles();

  // Updates param array in state
  const setParamObj = (event, field, paramName) => {
    const arr = params;
    const { name, value } = event.target;

    // Get param object at index and update it
    const index = params.findIndex(({ name }) => name === paramName);
    const indexObj = params[index];
    const newObj = { ...indexObj, [field]: value };

    // Replace object in array
    arr[index] = newObj;

    handleChangeArr(name, arr);
  };

  return dataset ? (
    sourceType === 'file' ? (
      <Grid container direction='row' justify='space-between' spacing={2}>
        <StaticFileParams localState={localState} setParamObj={setParamObj} />
        <DynamicFileParams handleChangeArr={handleChangeArr} localState={localState} />
      </Grid>
    ) : (
      <FormControl className={formControl} fullWidth>
        {params.length > 0 ? (
          <Grid container direction='row' justify='space-between' spacing={2}>
            {params.map(({ name, type, value }, index) => {
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
        ) : (
          <Typography variant='h6' color='inherit' align='center' className={typography}>
            No Parameters
          </Typography>
        )}
      </FormControl>
    )
  ) : (
    <Typography variant='h6' color='inherit' align='center' className={typography}>
      {getMsg(sourceType)}
    </Typography>
  );
};

export default ParametersTab;
