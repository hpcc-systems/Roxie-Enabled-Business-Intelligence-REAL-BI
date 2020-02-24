import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { BarChart as BarChartIcon, Timeline as LineChartIcon } from '@material-ui/icons';

const charts = [
  { name: 'Bar', value: 'bar' },
  { name: 'Line', value: 'line' },
];

const useStyles = makeStyles(theme => ({
  formControl: { margin: `${theme.spacing(1)}px 0`, marginTop: 25 },
  formControl2: { margin: `${theme.spacing(1)}px 0` },
  menuIcon: { marginRight: 10 },
}));

const GeneralTab = ({ handleChange, handleChangeObj, localState }) => {
  const { chartType, config, datasetObj } = localState;
  const { fields = [{ name: 'Choose a dataset', value: '' }] } = datasetObj;
  const { formControl, formControl2, menuIcon } = useStyles();

  return (
    <Fragment>
      <FormControl className={formControl} fullWidth>
        <InputLabel>Chart Type</InputLabel>
        <Select name="chartType" value={chartType} onChange={handleChange}>
          {charts.map(({ name, value }, index) => {
            return (
              <MenuItem key={index} value={value}>
                {(() => {
                  switch (value) {
                    case 'bar':
                      return <BarChartIcon className={menuIcon} />;
                    case 'line':
                      return <LineChartIcon className={menuIcon} />;
                    default:
                      return null;
                  }
                })()}
                {name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <TextField
        className={formControl2}
        fullWidth
        label="Chart Title"
        name="config:title"
        // Ternary is here to prevent error of input switching from uncontrolled to controlled
        value={config['title'] === undefined ? '' : config['title']}
        onChange={handleChangeObj}
        autoComplete="off"
      />
      <FormControl className={formControl2} fullWidth>
        <InputLabel>X Axis</InputLabel>
        <Select
          name="config:xAxis"
          // Ternary is here to prevent error of input switching from uncontrolled to controlled
          value={config['xAxis'] === undefined ? '' : config['xAxis']}
          onChange={handleChangeObj}
        >
          {fields.map(({ name, value = name }, index) => {
            return (
              <MenuItem key={index} value={value}>
                {name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <FormControl className={formControl2} fullWidth>
        <InputLabel>Y Axis</InputLabel>
        <Select
          name="config:yAxis"
          // Ternary is here to prevent error of input switching from uncontrolled to controlled
          value={config['yAxis'] === undefined ? '' : config['yAxis']}
          onChange={handleChangeObj}
        >
          {fields.map(({ name, value = name }, index) => {
            return (
              <MenuItem key={index} value={value}>
                {name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Fragment>
  );
};

export default GeneralTab;
