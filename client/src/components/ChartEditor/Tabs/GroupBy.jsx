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
import { hasStackedOption } from '../../../utils/misc';

// Changes message based on source type
const getMsg = sourceType => {
  return sourceType === 'file' ? 'Choose a file' : 'Choose a dataset';
};

const useStyles = makeStyles(theme => ({
  checkbox: { marginTop: theme.spacing(0.25), marginLeft: theme.spacing(2) },
  formControl: { marginTop: theme.spacing(1) },
  progress: { margin: 0, marginTop: 50 },
  topFormControl: { marginTop: theme.spacing(3) },
  typography: { marginTop: 20 },
}));

const GroupByTab = ({ handleChangeObj, handleCheckbox, localState }) => {
  const { chartID, config, dataset, selectedDataset = {}, sourceType } = localState;
  const { groupBy, stacked, type } = config;
  const { fields = [{ name: getMsg(sourceType), value: '' }] } = selectedDataset;
  const { checkbox, formControl, progress, topFormControl, typography } = useStyles();

  return dataset ? (
    <Grid container direction='row' alignContent='space-between' className={topFormControl}>
      <Grid item md={hasStackedOption(type) ? 10 : 12}>
        <FormControl className={formControl} fullWidth>
          <InputLabel>Group Field</InputLabel>
          {chartID && fields.length <= 1 ? (
            <CircularProgress className={progress} size={20} />
          ) : (
            <Select name='config:groupBy' value={groupBy || ''} onChange={handleChangeObj}>
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
      {hasStackedOption(type) && (
        <Grid item md={2}>
          <FormControlLabel
            className={checkbox}
            control={
              <Checkbox
                name='config:stacked'
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
      {getMsg(sourceType)}
    </Typography>
  );
};

export default GroupByTab;
