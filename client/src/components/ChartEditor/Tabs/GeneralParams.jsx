import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: { marginTop: theme.spacing(1) },
  progress: { margin: 0, marginTop: 50 },
}));

// Changes message based on source type
const getMsg = sourceType => {
  return sourceType === 'ecl'
    ? 'Run ECL Script'
    : sourceType === 'file'
    ? 'Choose a file'
    : 'Choose a dataset';
};

const GeneralChartParams = ({ eclRef, handleChangeObj, localState }) => {
  const { schema = [] } = eclRef.current;
  const { chartID, config, selectedDataset = {}, sourceType } = localState;
  const { fields = [] } = selectedDataset;
  const { formControl, progress } = useStyles();

  const fieldsArr =
    schema.length > 0 ? schema : fields.length > 0 ? fields : [{ name: getMsg(sourceType), value: '' }];

  return (
    <Grid item md={12}>
      <Grid container spacing={2}>
        <Grid item md={8}>
          <FormControl className={formControl} fullWidth>
            <InputLabel>X Axis</InputLabel>
            {chartID && fieldsArr.length <= 1 ? (
              <CircularProgress className={progress} size={20} />
            ) : (
              <Select name='config:xAxis' value={config.xAxis || ''} onChange={handleChangeObj}>
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
        <Grid item md={4}>
          <FormControl className={formControl} fullWidth>
            <TextField
              fullWidth
              label='Axis Label'
              name='config:xAxis_Label'
              value={config.xAxis_Label || ''}
              onChange={handleChangeObj}
              autoComplete='off'
            />
          </FormControl>
        </Grid>
        <Grid item md={8}>
          <FormControl className={formControl} fullWidth>
            <InputLabel>Y Axis</InputLabel>
            {chartID && fieldsArr.length <= 1 ? (
              <CircularProgress className={progress} size={20} />
            ) : (
              <Select name='config:yAxis' value={config.yAxis || ''} onChange={handleChangeObj}>
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
        <Grid item md={4}>
          <FormControl className={formControl} fullWidth>
            <TextField
              fullWidth
              label='Axis Label'
              name='config:yAxis_Label'
              value={config.yAxis_Label || ''}
              onChange={handleChangeObj}
              autoComplete='off'
            />
          </FormControl>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GeneralChartParams;
