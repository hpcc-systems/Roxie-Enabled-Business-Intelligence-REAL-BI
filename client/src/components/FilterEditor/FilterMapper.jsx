import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';
import { AddCircle as AddCircleIcon, Remove as RemoveIcon } from '@material-ui/icons';

// Create styles
const useStyles = makeStyles(theme => ({
  button: {
    margin: 0,
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(7),
    minWidth: 30,
    padding: 0,
  },
}));

// React Components
const clearSelection = () => <MenuItem value=''>Clear Selection</MenuItem>;

// Dropdown component to choose from a list of charts on the dashboard
const chartDropdown = (arr, field, index, updateArr) => (
  <FormControl fullWidth>
    <InputLabel>Chart</InputLabel>
    <Select name='chartID' value={field || ''} onChange={event => updateArr(event, index)}>
      {field !== '' ? clearSelection() : null}
      {arr.map(({ chartID, title }, index) => {
        return (
          <MenuItem key={index} value={chartID}>
            {title}
          </MenuItem>
        );
      })}
    </Select>
  </FormControl>
);

// Dropdown component to select query parameter for a particular chart
const paramDropdown = (arr, chartID, field, index, updateArr) => {
  let arrParams = [{ name: 'Choose a chart', value: '' }];

  // Confirm chart was chosen, array exists, and params exist in first object
  if (chartID && arr.length > 0 && arr[0].params) {
    arrParams = arr.find(({ chartID: localID }) => localID === chartID).params;
  }

  return (
    <FormControl fullWidth>
      <InputLabel>Parameter</InputLabel>
      <Select name='parameter' value={field || ''} onChange={event => updateArr(event, index)}>
        {field !== '' ? clearSelection() : null}
        {arrParams.map(({ name, value }, index) => {
          if (value !== '') {
            value = name;
          }

          return (
            <MenuItem key={index} value={value}>
              {name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

const FilterMapper = ({ charts, handleChangeArr, localState }) => {
  const { mappedParams = [], query } = localState;
  const { button } = useStyles();
  let dashboardCharts = charts.map(chart => {
    const { id: chartID, options, params, queryID, queryName } = chart;

    return { chartID, title: options.title, params, queryID, queryName };
  });

  // Remove query selected as table query
  dashboardCharts = dashboardCharts.filter(({ queryName }) => queryName !== query.name);

  const addField = () => {
    handleChangeArr('mappedParams', [...mappedParams, { chartID: '', parameter: '', queryID: '' }]);
  };

  const removeField = index => {
    const newArr = mappedParams;

    // Remove index
    newArr.splice(index, 1);

    handleChangeArr('mappedParams', newArr);
  };

  const updateChartDropdown = ({ target }, index) => {
    const newArr = mappedParams;
    const { chartID, queryID } = dashboardCharts.find(({ chartID }) => chartID === target.value); // Add query info to new array

    newArr[index] = { chartID, parameter: '', queryID };

    handleChangeArr('mappedParams', newArr);
  };

  const updateParamDropdown = ({ target }, index) => {
    const { value: parameter } = target;
    const newArr = mappedParams;

    newArr[index] = { ...newArr[index], parameter };

    handleChangeArr('mappedParams', newArr);
  };

  return (
    <Grid container direction='row' spacing={1}>
      {mappedParams.length === 1
        ? (() => {
            const index = 0;
            const { chartID, parameter } = mappedParams[index];

            return (
              <Fragment>
                <Grid item xs={2}>
                  <Button className={button} onClick={addField}>
                    <AddCircleIcon />
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  {chartDropdown(dashboardCharts, chartID, index, updateChartDropdown)}
                </Grid>
                <Grid item xs={4}>
                  {paramDropdown(dashboardCharts, chartID, parameter, index, updateParamDropdown)}
                </Grid>
              </Fragment>
            );
          })()
        : mappedParams.map((obj, index) => {
            const { chartID, parameter } = obj;

            return (
              <Fragment key={index}>
                <Grid item xs={2}>
                  <Button className={button} onClick={index === 0 ? addField : () => removeField(index)}>
                    {index === 0 ? <AddCircleIcon /> : <RemoveIcon />}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  {chartDropdown(dashboardCharts, chartID, index, updateChartDropdown)}
                </Grid>
                <Grid item xs={4}>
                  {paramDropdown(dashboardCharts, chartID, parameter, index, updateParamDropdown)}
                </Grid>
              </Fragment>
            );
          })}
    </Grid>
  );
};

export default FilterMapper;
