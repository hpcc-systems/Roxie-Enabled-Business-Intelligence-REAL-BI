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
  Tooltip,
} from '@material-ui/core';

// Constants
import { dataTypes } from '../../../constants';

const useStyles = makeStyles(theme => ({
  formControl: { marginTop: theme.spacing(1) },
  progress: { margin: 0, marginTop: 50 },
}));

// Changes message based on source type
const getMsg = sourceType => {
  return sourceType === 'file' ? 'Choose a file' : 'Choose a dataset';
};

const HistogramParams = ({ localState, updateAxisKey, handleChangeObj }) => {
  const { chartID, config, selectedDataset = {}, sourceType } = localState;
  const { axis1 = {}, binNumber } = config;
  const { fields = [{ name: getMsg(sourceType), value: '' }] } = selectedDataset;
  const { formControl, progress } = useStyles();
  const binNumTooltipText = `The number of bins, or buckets, the dataset should be split into.
  For example, specifiying "3" would split the dataset 3 times, resulting in 4 buckets
  of values.`;

  return (
    <Grid item md={12}>
      <Grid container spacing={2}>
        <Grid item md={3}>
          <FormControl className={formControl} fullWidth>
            <InputLabel>Bin</InputLabel>
            {chartID && fields.length <= 1 ? (
              <CircularProgress className={progress} size={20} />
            ) : (
              <Select name='axis1:value' value={axis1.value || ''} onChange={updateAxisKey}>
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
        <Grid item md={3}>
          <FormControl className={formControl} fullWidth>
            <TextField
              fullWidth
              label='Label'
              name='axis1:label'
              value={axis1.label || ''}
              onChange={updateAxisKey}
              autoComplete='off'
            />
          </FormControl>
        </Grid>
        <Grid item md={3}>
          <FormControl className={formControl} fullWidth>
            <InputLabel>Data Type</InputLabel>
            <Select name='axis1:type' value={axis1.type || 'string'} onChange={updateAxisKey}>
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
        <Grid item md={3}>
          <FormControl className={formControl} fullWidth>
            <Tooltip title={binNumTooltipText} placement='right'>
              <TextField
                fullWidth
                label='Number of Bins'
                name='config:binNumber'
                value={binNumber || ''}
                onChange={handleChangeObj}
                autoComplete='off'
              />
            </Tooltip>
          </FormControl>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HistogramParams;
