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

const DualLineParams = ({ localState, updateAxisKey }) => {
  const { chartID, config, selectedDataset = {}, sourceType } = localState;
  const { axis1 = {}, axis2 = {}, axis3 = {} } = config;
  const { fields = [{ name: getMsg(sourceType), value: '' }] } = selectedDataset;
  const { formControl, progress } = useStyles();

  return (
    <Grid item md={12}>
      <Grid container spacing={2}>
        <Grid item md={4}>
          <FormControl className={formControl} fullWidth>
            <InputLabel>X Axis</InputLabel>
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
        <Grid item md={4}>
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
        <Grid item md={4}>
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

        <Grid item md={6}>
          <FormControl className={formControl} fullWidth>
            <InputLabel>Y Axis 1</InputLabel>
            {chartID && fields.length <= 1 ? (
              <CircularProgress className={progress} size={20} />
            ) : (
              <Select name='axis2:value' value={axis2.value || ''} onChange={updateAxisKey}>
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
        <Grid item md={6}>
          <FormControl className={formControl} fullWidth>
            <InputLabel>Data Type</InputLabel>
            <Select name='axis2:type' value={axis2.type || 'string'} onChange={updateAxisKey}>
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
        <Grid item md={6}>
          <FormControl className={formControl} fullWidth>
            <InputLabel>Y Axis 2</InputLabel>
            {chartID && fields.length <= 1 ? (
              <CircularProgress className={progress} size={20} />
            ) : (
              <Select name='axis3:value' value={axis3.value || ''} onChange={updateAxisKey}>
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
        <Grid item md={6}>
          <FormControl className={formControl} fullWidth>
            <InputLabel>Data Type</InputLabel>
            <Select name='axis3:type' value={axis3.type || 'string'} onChange={updateAxisKey}>
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
      </Grid>
    </Grid>
  );
};

export default DualLineParams;
