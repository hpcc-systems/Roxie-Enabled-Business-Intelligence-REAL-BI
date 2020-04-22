import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';

// Constants
import { hasStackedOption } from '../../../constants';

const useStyles = makeStyles(() => ({
  formControl: { marginTop: 25 },
  formControl2: { marginTop: 20 },
  progress: { margin: 0, marginTop: 50 },
  typography: { marginTop: 20 },
}));

const GroupByTab = ({ handleChangeObj, handleCheckbox, localState }) => {
  const {
    chartID,
    chartType,
    dataset,
    options: { groupBy, stacked },
    selectedDataset,
  } = localState;
  const { fields = [{ name: 'Choose a dataset', value: '' }] } = selectedDataset;
  const { formControl, formControl2, progress, typography } = useStyles();

  return dataset ? (
    <Grid container direction='row' alignContent='space-between'>
      <Grid item md={hasStackedOption(chartType) ? 10 : 12}>
        <FormControl className={formControl} fullWidth>
          <InputLabel>Group Field</InputLabel>
          {chartID && fields.length <= 1 ? (
            <CircularProgress className={progress} size={20} />
          ) : (
            <Select name='options:groupBy' value={groupBy || ''} onChange={handleChangeObj}>
              {groupBy !== '' && <MenuItem value={''}>Clear Selection</MenuItem>}
              {fields.map(({ name, value = name }, index) => {
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
      {hasStackedOption(chartType) && (
        <Grid item md={2}>
          <FormControlLabel
            className={formControl2}
            control={
              <Checkbox
                name='options:stacked'
                checked={stacked || false}
                onChange={handleCheckbox}
                color='primary'
              />
            }
            label='Stacked'
            labelPlacement='top'
          />
        </Grid>
      )}
    </Grid>
  ) : (
    <Typography variant='h6' color='inherit' align='center' className={typography}>
      Choose a dataset
    </Typography>
  );
};

export default GroupByTab;
