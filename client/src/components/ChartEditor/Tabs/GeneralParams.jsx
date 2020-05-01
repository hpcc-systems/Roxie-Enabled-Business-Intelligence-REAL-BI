import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: { marginTop: theme.spacing(1) },
  progress: { margin: 0, marginTop: 50 },
}));

const GeneralChartParams = ({ handleChangeObj, localState }) => {
  const { chartID, options, selectedDataset } = localState;
  const { fields = [{ name: 'Choose a dataset', value: '' }] } = selectedDataset;
  const { formControl, progress } = useStyles();

  return (
    <Fragment>
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
    </Fragment>
  );
};

export default GeneralChartParams;
