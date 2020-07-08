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
  return sourceType === 'file' ? 'Choose a file' : 'Choose a dataset';
};

const HeatMapParams = ({ handleChangeObj, localState }) => {
  const { chartID, options, selectedDataset = {}, sourceType } = localState;
  const { fields = [{ name: getMsg(sourceType), value: '' }] } = selectedDataset;
  const { formControl, progress } = useStyles();

  return (
    <Grid item md={12}>
      <Grid container spacing={2}>
        <Grid item md={8}>
          <FormControl className={formControl} fullWidth>
            <InputLabel>X Axis</InputLabel>
            {chartID && fields.length <= 1 ? (
              <CircularProgress className={progress} size={20} />
            ) : (
              <Select name='options:xAxis' value={options.xAxis || ''} onChange={handleChangeObj}>
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
        <Grid item md={4}>
          <FormControl className={formControl} fullWidth>
            <TextField
              fullWidth
              label='Axis Label'
              name='options:xAxis_Label'
              value={options.xAxis_Label || ''}
              onChange={handleChangeObj}
              autoComplete='off'
            />
          </FormControl>
        </Grid>
        <Grid item md={8}>
          <FormControl className={formControl} fullWidth>
            <InputLabel>Y Axis</InputLabel>
            {chartID && fields.length <= 1 ? (
              <CircularProgress className={progress} size={20} />
            ) : (
              <Select name='options:yAxis' value={options.yAxis || ''} onChange={handleChangeObj}>
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
        <Grid item md={4}>
          <FormControl className={formControl} fullWidth>
            <TextField
              fullWidth
              label='Axis Label'
              name='options:yAxis_Label'
              value={options.yAxis_Label || ''}
              onChange={handleChangeObj}
              autoComplete='off'
            />
          </FormControl>
        </Grid>
        <Grid item md={12}>
          <FormControl className={formControl} fullWidth>
            <InputLabel>Index Field Furled </InputLabel>
            {chartID && fields.length <= 1 ? (
              <CircularProgress className={progress} size={20} />
            ) : (
              <Select name='options:colorField' value={options.colorField || ''} onChange={handleChangeObj}>
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
      </Grid>
    </Grid>
  );
};

export default HeatMapParams;
