import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';
import { Remove as RemoveIcon } from '@material-ui/icons';

// Create styles
const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(2.5, 0, 0, 1),
    minWidth: 30,
    padding: 0,
  },
  errorText: { color: theme.palette.error.dark },
}));

// Dropdown component to choose from a list of charts on the dashboard
const chartDropdown = (arr, field, index, updateArr, errors, errStyle) => {
  const targetChartError = errors.find(err => err[`targetChart${index}`]);

  return (
    <FormControl fullWidth>
      <InputLabel>Target Chart</InputLabel>
      <Select
        name='targetChart'
        value={field || ''}
        onChange={event => updateArr(event, index)}
        error={targetChartError !== undefined}
      >
        {arr.map(({ chartID, title }, index) => {
          title = !title ? 'No Chart Title' : title;

          return (
            <MenuItem key={index} value={chartID}>
              {title}
            </MenuItem>
          );
        })}
      </Select>
      {targetChartError !== undefined && (
        <FormHelperText className={errStyle}>{targetChartError[`targetChart${index}`]}</FormHelperText>
      )}
    </FormControl>
  );
};

// Dropdown component to select field for a particular chart
const fieldDropdown = (arr, chartID, field, index, updateArr, errors, errStyle) => {
  const targetParamError = errors.find(err => err[`targetParam${index}`]);
  let fieldsArr = [];

  // Confirm chart was chosen, array exists, and fields exist in first object
  if (chartID && arr.length > 0) {
    const chart = arr.find(obj => obj.chartID === chartID);

    fieldsArr = chart.params || [];
  }

  return (
    <FormControl fullWidth>
      <InputLabel>Target Parameter</InputLabel>
      <Select
        name='targetParam'
        value={field || ''}
        onChange={event => updateArr(event, index)}
        error={targetParamError !== undefined}
      >
        {fieldsArr.map(({ name }, index) => {
          return (
            <MenuItem key={index} value={name}>
              {name}
            </MenuItem>
          );
        })}
      </Select>
      {targetParamError !== undefined && (
        <FormHelperText className={errStyle}>{targetParamError[`targetParam${index}`]}</FormHelperText>
      )}
    </FormControl>
  );
};

const FilterMapper = ({ handleChange, localState }) => {
  const { errors = [], params } = localState;
  const { button, errorText } = useStyles();

  let { charts } = useSelector(state => state.chart);

  // Remove charts that do not have params that dashboard filters can use
  charts = charts.filter(chart => {
    const { params = [] } = chart.config;
    return params.length > 0;
  });

  // Configure charts to get formatted array of objects
  charts = charts.map(chart => {
    const { id: chartID, config } = chart;
    const { params, title } = config;

    return { chartID, params, title };
  });

  const updateField = (event, index) => {
    const { name, value } = event.target;
    const newParamsArr = new Array(...params);

    // Update index
    newParamsArr[index] = { ...newParamsArr[index], [name]: value };

    // Add new object to end of array for next entry
    if (newParamsArr.length - 1 === index) {
      newParamsArr.push({ targetChart: '', targetParam: '' });
    }

    return handleChange(null, { name: 'params', value: newParamsArr });
  };

  const removeParam = index => {
    const newParamsArr = new Array(...params);

    newParamsArr.splice(index, 1);

    // Array is empty, add an empty object
    if (newParamsArr.length === 0) {
      newParamsArr.push({ targetChart: '', targetParam: '' });
    }

    return handleChange(null, { name: 'params', value: newParamsArr });
  };

  return params.map(({ targetChart, targetParam }, index) => {
    const isPopulated = Boolean(targetChart || targetParam);

    return (
      <Fragment key={index}>
        {isPopulated && (
          <Grid item xs={1}>
            <Button className={button} onClick={() => removeParam(index)}>
              <RemoveIcon />
            </Button>
          </Grid>
        )}
        <Grid item xs={isPopulated ? 5 : 6}>
          {chartDropdown(charts, targetChart, index, updateField, errors, errorText)}
        </Grid>
        <Grid item xs={6}>
          {fieldDropdown(charts, targetChart, targetParam, index, updateField, errors, errorText)}
        </Grid>
      </Fragment>
    );
  });
};

export default FilterMapper;
