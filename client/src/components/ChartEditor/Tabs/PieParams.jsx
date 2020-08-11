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

const PieParams = ({ handleChangeObj, localState }) => {
  const { chartID, config, selectedDataset = {}, sourceType } = localState;
  const { fields = [{ name: getMsg(sourceType), value: '' }] } = selectedDataset;
  const { formControl, progress } = useStyles();

  return (
    <Grid item md={12}>
      <Grid container spacing={2}>
        <Grid item md={8}>
          <FormControl className={formControl} fullWidth>
            <InputLabel>Name</InputLabel>
            {chartID && fields.length <= 1 ? (
              <CircularProgress className={progress} size={20} />
            ) : (
              <Select name='config:name' value={config.name || ''} onChange={handleChangeObj}>
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
              label='Name Label'
              name='config:name_Label'
              value={config.name_Label || ''}
              onChange={handleChangeObj}
              autoComplete='off'
            />
          </FormControl>
        </Grid>
        <Grid item md={8}>
          <FormControl className={formControl} fullWidth>
            <InputLabel>Value</InputLabel>
            {chartID && fields.length <= 1 ? (
              <CircularProgress className={progress} size={20} />
            ) : (
              <Select name='config:value' value={config.value || ''} onChange={handleChangeObj}>
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
              label='Value Label'
              name='config:value_Label'
              value={config.value_Label || ''}
              onChange={handleChangeObj}
              autoComplete='off'
            />
          </FormControl>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PieParams;
