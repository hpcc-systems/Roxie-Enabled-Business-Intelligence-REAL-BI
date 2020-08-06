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

const ParametersTab = ({ handleChangeArr, handleChangeObj, localState }) => {
  const { config, dataset, sourceType } = localState;
  const { params = [] } = config;
  const { formControl, typography } = useStyles();

  // Updates param array in state
  const setParamObj = (event, paramName) => {
    const arr = params;
    const { value } = event.target;

    // Get param object at index and update it
    const index = params.findIndex(({ name }) => name === paramName);
    const indexObj = params[index];
    const newObj = { ...indexObj, value };

    // Replace object in array
    arr[index] = newObj;

    handleChangeObj(null, { name: 'config:params', value: arr });
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
                    value={value || ''}
                    onChange={event => setParamObj(event, name)}
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
