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
import { getMessage, hasStackedOption } from '../../../utils/misc';

const useStyles = makeStyles(theme => ({
  checkbox: { marginTop: theme.spacing(0.25), marginLeft: theme.spacing(2) },
  formControl: { marginTop: theme.spacing(1) },
  progress: { margin: 0, marginTop: 50 },
  topFormControl: { marginTop: theme.spacing(3) },
  typography: { marginTop: 20 },
}));

const GroupByTab = ({ eclRef, handleChangeObj, handleCheckbox, localState }) => {
  const { dataset: eclDataset, schema = [] } = eclRef.current;
  const { chartID, config, dataset, selectedDataset = {}, sourceType } = localState;
  const { groupBy, stacked, type } = config;
  const { fields = [] } = selectedDataset;
  const { checkbox, formControl, progress, topFormControl, typography } = useStyles();

  const fieldsArr =
    schema.length > 0 ? schema : fields.length > 0 ? fields : [{ name: getMessage(sourceType), value: '' }];

  return dataset || eclDataset ? (
    <Grid container direction='row' alignContent='space-between' className={topFormControl}>
      <Grid item md={hasStackedOption(type) ? 10 : 12}>
        <FormControl className={formControl} fullWidth>
          <InputLabel>Group Field</InputLabel>
          {chartID && fieldsArr.length <= 1 ? (
            <CircularProgress className={progress} size={20} />
          ) : (
            <Select name='config:groupBy' value={groupBy || ''} onChange={handleChangeObj}>
              {groupBy !== '' && <MenuItem value={''}>Clear Selection</MenuItem>}
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
      {getMessage(sourceType)}
    </Typography>
  );
};

export default GroupByTab;
