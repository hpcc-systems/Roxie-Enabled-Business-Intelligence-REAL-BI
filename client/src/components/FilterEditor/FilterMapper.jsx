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

// Dropdown component to choose from a list of charts on the dashboard
const chartDropdown = (arr, field, index, updateArr) => (
  <FormControl fullWidth>
    <InputLabel>Chart</InputLabel>
    <Select name='chartID' value={field} onChange={event => updateArr(event, index)}>
      {arr.map(({ chartID, title }, index) => {
        title = !title ? 'No Chart Title' : title;

        return (
          <MenuItem key={index} value={chartID}>
            {title}
          </MenuItem>
        );
      })}
    </Select>
  </FormControl>
);

// Dropdown component to select source parameter for a particular chart
const paramDropdown = (arr, chartID, field, index, updateArr) => {
  let arrParams = [];

  // Confirm chart was chosen, array exists, and params exist in first object
  if (chartID && arr.length > 0 && arr[0].params) {
    arrParams = arr.find(obj => obj.chartID === chartID).params;
  }

  return (
    <FormControl fullWidth>
      <InputLabel>Parameter</InputLabel>
      <Select name='parameter' value={field} onChange={event => updateArr(event, index)}>
        {arrParams.map(({ name }, index) => {
          return (
            <MenuItem key={index} value={name}>
              {name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

const FilterMapper = ({ charts, handleChangeArr, localState }) => {
  const { mappedParams = [] } = localState;
  const { button } = useStyles();

  // Configure charts to get formatted array of objects
  charts = charts.map(chart => {
    const { id: chartID, config, sourceID, sourceName } = chart;
    const { params, title } = config;

    return { chartID, title, params, sourceID, sourceName };
  });

  const addField = () => {
    handleChangeArr('mappedParams', [...mappedParams, { chartID: '', parameter: '', sourceID: '' }]);
  };

  const removeField = index => {
    const newArr = mappedParams;

    // Remove index
    newArr.splice(index, 1);

    handleChangeArr('mappedParams', newArr);
  };

  const updateChartDropdown = ({ target }, index) => {
    const newArr = mappedParams;
    const { chartID, sourceID } = charts.find(({ chartID }) => chartID === target.value); // Add source info to new array

    newArr[index] = { chartID, parameter: '', sourceID };

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
      {mappedParams.map((obj, index) => {
        const { chartID, parameter } = obj;

        return (
          <Fragment key={index}>
            <Grid item xs={2}>
              <Button className={button} onClick={index === 0 ? addField : () => removeField(index)}>
                {index === 0 ? <AddCircleIcon /> : <RemoveIcon />}
              </Button>
            </Grid>
            <Grid item xs={6}>
              {chartDropdown(charts, chartID, index, updateChartDropdown)}
            </Grid>
            <Grid item xs={4}>
              {paramDropdown(charts, chartID, parameter, index, updateParamDropdown)}
            </Grid>
          </Fragment>
        );
      })}
    </Grid>
  );
};

export default FilterMapper;
