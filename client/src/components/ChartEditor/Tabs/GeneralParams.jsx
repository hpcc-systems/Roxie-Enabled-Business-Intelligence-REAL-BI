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
  TextField,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: { marginTop: theme.spacing(1) },
  progress: { margin: 0, marginTop: 50 },
  checkbox: { margin: theme.spacing(2.5, 0, 0, 0.5) },
}));

// Changes message based on source type
const getMsg = sourceType => {
  return sourceType === 'ecl'
    ? 'Run ECL Script'
    : sourceType === 'file'
    ? 'Choose a file'
    : 'Choose a dataset';
};

const GeneralChartParams = ({ eclRef, localState, updateAxisKey, checkboxUpdated }) => {
  const { schema = [] } = eclRef.current;
  const { chartID, config, selectedDataset = {}, sourceType } = localState;
  const { axis1 = {}, axis2 = {} } = config;
  const { fields = [] } = selectedDataset;
  const { formControl, progress, checkbox } = useStyles();
  const showTicksCheckboxLabel = 'Show Value Labels';

  const fieldsArr =
    schema.length > 0 ? schema : fields.length > 0 ? fields : [{ name: getMsg(sourceType), value: '' }];

  return (
    <Grid item md={12}>
      <Grid container spacing={2}>
        <Grid item md={5}>
          <FormControl className={formControl} fullWidth>
            <InputLabel>X Axis</InputLabel>
            {chartID && fieldsArr.length <= 1 ? (
              <CircularProgress className={progress} size={20} />
            ) : (
              <Select name='axis1:value' value={axis1.value || ''} onChange={updateAxisKey}>
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
        <Grid item md={3}>
          <FormControl className={formControl} fullWidth>
            <TextField
              fullWidth
              label='Axis Label'
              name='axis1:label'
              value={axis1.label || ''}
              onChange={updateAxisKey}
              autoComplete='off'
            />
          </FormControl>
        </Grid>
        <Grid item md={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={axis1.showTickLabels}
                onChange={checkboxUpdated}
                name='axis1:showTickLabels'
              />
            }
            className={checkbox}
            label={showTicksCheckboxLabel}
          />
        </Grid>
        <Grid item md={5}>
          <FormControl className={formControl} fullWidth>
            <InputLabel>Y Axis</InputLabel>
            {chartID && fieldsArr.length <= 1 ? (
              <CircularProgress className={progress} size={20} />
            ) : (
              <Select name='axis2:value' value={axis2.value || ''} onChange={updateAxisKey}>
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
        <Grid item md={3}>
          <FormControl className={formControl} fullWidth>
            <TextField
              fullWidth
              label='Axis Label'
              name='axis2:label'
              value={axis2.label || ''}
              onChange={updateAxisKey}
              autoComplete='off'
            />
          </FormControl>
        </Grid>
        <Grid item md={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={axis2.showTickLabels}
                onChange={checkboxUpdated}
                name='axis2:showTickLabels'
              />
            }
            className={checkbox}
            label={showTicksCheckboxLabel}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GeneralChartParams;
