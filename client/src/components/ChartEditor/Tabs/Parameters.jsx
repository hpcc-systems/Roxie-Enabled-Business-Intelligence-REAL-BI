import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: { margin: `${theme.spacing(1)}px 0` },
  progress: { margin: 0, marginTop: 50 },
  typography: { marginTop: 20 },
}));

const ParametersTab = ({ handleChangeArr, localState }) => {
  const { chartID, dataset, datasets = [], params = [] } = localState;
  const { formControl, progress, typography } = useStyles();

  // Remove the dataset used for chart data from the list of options
  const datasetOptions = datasets.filter(({ name }) => name !== dataset);

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
        <Grid container direction="row" justify="space-between" alignItems="center" spacing={1}>
          {params.map(({ name, type }, index) => {
            return (
              <Fragment key={index}>
                <Grid item xs={6}>
                  <TextField
                    label={`${name}: ${type}`}
                    name="params"
                    value={params[index].value || ''}
                    onChange={event => setParamObj(event, 'value', index)}
                    autoComplete="off"
                    className={formControl}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl className={formControl} fullWidth>
                    <InputLabel>Values Dataset</InputLabel>
                    {chartID && datasetOptions.length === 0 ? (
                      <CircularProgress className={progress} size={20} />
                    ) : (
                      <Select
                        name="params"
                        value={params[index].dataset || ''}
                        onChange={event => setParamObj(event, 'dataset', index)}
                      >
                        {datasetOptions.map(({ name }, index) => {
                          return (
                            <MenuItem key={index} value={name}>
                              {name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  </FormControl>
                </Grid>
              </Fragment>
            );
          })}
        </Grid>
      ) : (
        <Typography variant="h6" color="inherit" align="center" className={typography}>
          No Parameters
        </Typography>
      )}
    </FormControl>
  ) : (
    <Typography variant="h6" color="inherit" align="center" className={typography}>
      Choose a dataset
    </Typography>
  );
};

export default ParametersTab;
