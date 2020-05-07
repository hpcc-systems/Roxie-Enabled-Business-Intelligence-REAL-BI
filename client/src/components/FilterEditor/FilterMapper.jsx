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
const chartDropdown = (charts, field, index, updateArr) => (
  <FormControl fullWidth>
    <InputLabel>Chart</InputLabel>
    <Select name='queryID' value={field || ''} onChange={event => updateArr(event, index)}>
      {field !== '' ? clearSelection() : null}
      {charts.map(({ queryID, title }, index) => {
        return (
          <MenuItem key={index} value={queryID}>
            {title}
          </MenuItem>
        );
      })}
    </Select>
  </FormControl>
);
const paramDropdown = (charts, queryID, field, index, updateArr) => {
  let params = [{ name: 'Choose a chart', value: '' }];

  if (queryID) {
    params = charts.filter(({ queryID: localID }) => localID === queryID)[0].params;
  }

  return (
    <FormControl fullWidth>
      <InputLabel>Parameter</InputLabel>
      <Select name='parameter' value={field || ''} onChange={event => updateArr(event, index)}>
        {field !== '' ? clearSelection() : null}
        {params.map(({ name, value }, index) => {
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
  const { mappedParams, query } = localState;
  const { button } = useStyles();
  let dashboardCharts = charts.map(({ options: { title }, params, queryID, queryName }) => ({
    title,
    params,
    queryID,
    queryName,
  }));

  // Remove query selected as table query
  dashboardCharts = dashboardCharts.filter(({ queryName }) => queryName !== query.name);

  const addField = () => {
    handleChangeArr('mappedParams', [...mappedParams, { queryID: '', parameter: '' }]);
  };

  const removeField = index => {
    const newArr = mappedParams;

    // Remove index
    newArr.splice(index, 1);

    handleChangeArr('mappedParams', newArr);
  };

  const updateArr = ({ target }, index) => {
    const { name, value } = target;
    const newArr = mappedParams;

    newArr[index] = { ...newArr[index], [name]: value };

    handleChangeArr('mappedParams', newArr);
  };

  return (
    <Grid container direction='row' spacing={1}>
      {mappedParams.length === 1
        ? (() => {
            const index = 0;
            const { parameter, queryID } = mappedParams[index];

            return (
              <Fragment>
                <Grid item xs={2}>
                  <Button className={button} onClick={addField}>
                    <AddCircleIcon />
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  {chartDropdown(dashboardCharts, queryID, index, updateArr)}
                </Grid>
                <Grid item xs={4}>
                  {paramDropdown(dashboardCharts, queryID, parameter, index, updateArr)}
                </Grid>
              </Fragment>
            );
          })()
        : mappedParams.map((obj, index) => {
            const { parameter, queryID } = obj;

            return (
              <Fragment key={index}>
                <Grid item xs={2}>
                  <Button className={button} onClick={index === 0 ? addField : () => removeField(index)}>
                    {index === 0 ? <AddCircleIcon /> : <RemoveIcon />}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  {chartDropdown(dashboardCharts, queryID, index, updateArr)}
                </Grid>
                <Grid item xs={4}>
                  {paramDropdown(dashboardCharts, queryID, parameter, index, updateArr)}
                </Grid>
              </Fragment>
            );
          })}
    </Grid>
  );
};

export default FilterMapper;
