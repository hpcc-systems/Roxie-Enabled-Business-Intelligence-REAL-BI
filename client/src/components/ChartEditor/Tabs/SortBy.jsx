import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';

// Constants
import { dataTypes } from '../../../constants';

// Utils
import { getMessage } from '../../../utils/misc';

const useStyles = makeStyles(theme => ({
  checkbox: { marginTop: theme.spacing(0.25), marginLeft: theme.spacing(2) },
  formControl: { marginTop: theme.spacing(1) },
  progress: { margin: 0, marginTop: 50 },
  topFormControl: { marginTop: theme.spacing(3) },
  typography: { marginTop: 20 },
}));

const SortBy = ({ eclRef, localState, updateAxisKey }) => {
  const { dataset: eclDataset, schema = [] } = eclRef.current;
  const { chartID, configuration, dataset, selectedDataset = {}, sourceType } = localState;
  const { sortBy = {} } = configuration;
  const { fields = [] } = selectedDataset;
  const { formControl, progress, topFormControl, typography } = useStyles();

  const fieldsArr =
    schema.length > 0 ? schema : fields.length > 0 ? fields : [{ name: getMessage(sourceType), value: '' }];

  return dataset || eclDataset ? (
    <Grid container direction='row' alignContent='space-between' spacing={1} className={topFormControl}>
      <Grid item xs={12} md={6}>
        <FormControl className={formControl} fullWidth>
          <InputLabel>Sort Field</InputLabel>
          {chartID && fieldsArr.length <= 1 ? (
            <CircularProgress className={progress} size={20} />
          ) : (
            <Select name='sortBy:value' value={sortBy.value || ''} onChange={updateAxisKey}>
              {sortBy.value !== '' && <MenuItem value=''>Clear Selection</MenuItem>}
              {fieldsArr.map(({ name, value = name }, index) => {
                return (
                  <MenuItem key={index} value={value}>
                    {name}
                  </MenuItem>
                );
              })}
            </Select>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={6} md={3}>
        <FormControl className={formControl} fullWidth>
          <InputLabel>Data Type</InputLabel>
          <Select name='sortBy:type' value={sortBy.type || 'string'} onChange={updateAxisKey}>
            {dataTypes.map((dataType, index) => {
              return (
                <MenuItem key={index} value={dataType}>
                  {dataType}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6} md={3}>
        <FormControl className={formControl} fullWidth>
          <InputLabel>Sort Order</InputLabel>
          <Select name='sortBy:order' value={sortBy.order || 'asc'} onChange={updateAxisKey}>
            {['asc', 'desc'].map((value, index) => {
              return (
                <MenuItem key={index} value={value}>
                  {value}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  ) : (
    <Typography variant='h6' color='inherit' align='center' className={typography}>
      {getMessage(sourceType)}
    </Typography>
  );
};

export default SortBy;
