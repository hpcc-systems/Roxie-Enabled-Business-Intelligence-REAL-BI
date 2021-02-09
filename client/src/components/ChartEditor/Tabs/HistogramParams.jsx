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

// Utils
import { getMessage } from '../../../utils/misc';

// Constants
import { dataTypes, messages } from '../../../constants';

const useStyles = makeStyles(theme => ({
  formControl: { marginTop: theme.spacing(1) },
  progress: { margin: 0, marginTop: 50 },
}));

const HistogramParams = ({ eclRef, localState, updateAxisKey, handleChangeObj }) => {
  const { schema = [] } = eclRef.current;
  const { chartID, configuration, selectedDataset = {}, sourceType } = localState;
  const { axis1 = {}, binWidth } = configuration;
  const { fields = [] } = selectedDataset;
  const { formControl, progress } = useStyles();
  const binNumTooltipText = 'The width of each bin. Affects how the dataset is divided on the chart.';

  const fieldsArr =
    schema.length > 0 ? schema : fields.length > 0 ? fields : [{ name: getMessage(sourceType), value: '' }];

  return (
    <Grid item md={12}>
      <Grid container spacing={2}>
        <Grid item md={3}>
          <FormControl className={formControl} fullWidth>
            <InputLabel>Bin</InputLabel>
            {chartID && messages.indexOf(fieldsArr[0].name) > -1 ? (
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
                label='Bin Width'
                name='configuration:binWidth'
                value={binWidth || ''}
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
