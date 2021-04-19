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

const ParametersTab = props => {
  const { eclRef, handleChange, localState } = props;
  const { dataset: eclDataset } = eclRef.current;
  const { filterParams = [], sourceDataset, sourceType } = localState;
  const { formControl, typography } = useStyles();

  // Updates param array in state
  const setParamObj = (event, paramName) => {
    const newArr = [...filterParams];

    // Get param object at index and update it
    const index = newArr.findIndex(({ name }) => name === paramName);
    newArr[index] = { ...newArr[index], value: event.target.value };

    handleChange(null, { name: 'filterParams', value: newArr });
  };

  return sourceDataset || eclDataset ? (
    sourceType === 'file' ? (
      <Grid container direction='row' justify='space-between' spacing={2}>
        <StaticFileParams {...props} setParamObj={setParamObj} />
        <DynamicFileParams {...props} />
      </Grid>
    ) : (
      <FormControl className={formControl} fullWidth>
        {filterParams.length > 0 ? (
          <Grid container direction='row' justify='space-between' spacing={2}>
            {filterParams.map(({ name, type, value }, index) => {
              return (
                <Grid key={index} item xs={12}>
                  <TextField
                    label={`${name}${type ? `: ${type}` : ''}`}
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
