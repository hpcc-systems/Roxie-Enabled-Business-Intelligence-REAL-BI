import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, Grid, TextField, Typography } from '@material-ui/core';

// React Components
import { DynamicFileParams, StaticFileParams } from './FileParams';

// Utils
import { getMessage } from '../../../utils/misc';

const useStyles = makeStyles(theme => ({
  formControl: { marginTop: theme.spacing(1) },
  progress: { margin: 0, marginTop: 50 },
  typography: { marginTop: 20 },
}));

const ParametersTab = ({ eclRef, handleChangeArr, handleChangeObj, localState }) => {
  const { dataset: eclDataset } = eclRef.current;
  const { config, dataset, sourceType } = localState;
  const { params = [] } = config;
  const { formControl, typography } = useStyles();

  // Updates param array in state
  const setParamObj = (event, paramName) => {
    const arr = params;
    const { value } = event.target;

    // Get param object at index and update it
    let index = params.findIndex(({ name }) => name === paramName);
    let indexObj;

    // Add param if not already in array
    if (index === -1) {
      index = arr.length;
      indexObj = { name: paramName, value: '', type: '' };
    } else {
      indexObj = params[index];
    }

    const newObj = { ...indexObj, value };

    // Replace object in array
    arr[index] = newObj;

    handleChangeObj(null, { name: 'config:params', value: arr });
  };

  return dataset || eclDataset ? (
    sourceType !== 'query' ? (
      <Grid container direction='row' justify='space-between' spacing={2}>
        <StaticFileParams localState={localState} setParamObj={setParamObj} />
        {sourceType === 'file' && (
          <DynamicFileParams handleChangeArr={handleChangeArr} localState={localState} />
        )}
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
      {getMessage(sourceType)}
    </Typography>
  );
};

export default ParametersTab;
