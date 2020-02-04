import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';

// Create styles
const useStyles = makeStyles(() => ({
  formControl: { marginBottom: 32 },
}));

const ChartLayout = ({ chart, config, fields, handleChangeObj }) => {
  const { formControl } = useStyles();

  return (
    <Fragment>
      <TextField
        className={formControl}
        fullWidth
        label="Chart Title"
        name="config:title"
        // Ternary is here to prevent error of input switching from uncontrolled to controlled
        value={config['title'] === undefined ? '' : config['title']}
        onChange={handleChangeObj}
        autoComplete="off"
      />
      {chart === 'bar' ? (
        <Fragment>
          <FormControl className={formControl} fullWidth>
            <InputLabel>X Axis</InputLabel>
            <Select
              name="config:xAxis"
              // Ternary is here to prevent error of input switching from uncontrolled to controlled
              value={config['xAxis'] === undefined ? '' : config['xAxis']}
              onChange={handleChangeObj}
            >
              {fields.map((field, index) => {
                return (
                  <MenuItem key={index} value={field}>
                    {field}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl className={formControl} fullWidth>
            <InputLabel>Y Axis</InputLabel>
            <Select
              name="config:yAxis"
              // Ternary is here to prevent error of input switching from uncontrolled to controlled
              value={config['yAxis'] === undefined ? '' : config['yAxis']}
              onChange={handleChangeObj}
            >
              {fields.map((field, index) => {
                return (
                  <MenuItem key={index} value={field}>
                    {field}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Fragment>
      ) : (
        ''
      )}
    </Fragment>
  );
};

export default ChartLayout;
