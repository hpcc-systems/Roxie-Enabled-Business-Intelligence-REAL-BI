import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import { AddCircle as AddCircleIcon, Remove as RemoveIcon } from '@material-ui/icons';

// Utils
import { getMessage } from '../../../utils/misc';

// Create styles
const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(2.5, 0, 0, 1),
    minWidth: 30,
    padding: 0,
  },
  grid: { marginTop: theme.spacing(2) },
  typography: { marginTop: 20 },
}));

// Dropdown component to choose from a list of charts on the dashboard
const chartDropdown = (arr, field, index, updateArr) => (
  <FormControl fullWidth>
    <InputLabel>Mapped Chart</InputLabel>
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

// Dropdown component to select field for a particular chart
const fieldDropdown = (arr, chartID, field, index, updateArr) => {
  let fieldsArr = [];

  // Confirm chart was chosen, array exists, and params exist in first object
  if (chartID && arr.length > 0 && arr[0].params) {
    fieldsArr = arr.find(obj => obj.chartID === chartID).params;
  }

  return (
    <FormControl fullWidth>
      <InputLabel>Mapped Field</InputLabel>
      <Select name='mappedField' value={field} onChange={event => updateArr(event, index)}>
        {fieldsArr.map(({ name }, index) => {
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

const RelationMapper = ({ eclRef, handleChangeArr, localState }) => {
  const { dataset: eclDataset, schema = [] } = eclRef.current;
  const { chartID, dataset, relations = [], selectedDataset = {}, sourceType } = localState;
  const { fields: datasetFields = [] } = selectedDataset;
  const { button, grid, typography } = useStyles();

  let { charts } = useSelector(state => state.chart);

  // Configure charts to get formatted array of objects
  charts = charts.map(chart => {
    const { id: chartID, config, sourceID, sourceName } = chart;
    const { params, title } = config;

    return { chartID, title, params, sourceID, sourceName };
  });

  // Remove current chart from list of available charts
  charts = charts.filter(chart => chart.chartID !== chartID);

  const addField = () => {
    handleChangeArr('relations', [...relations, { originField: '', mappedChart: '', mappedField: '' }]);
  };

  const removeField = index => {
    const newArr = relations;

    // Remove index
    newArr.splice(index, 1);

    handleChangeArr('relations', newArr);
  };

  const updateField = (event, index) => {
    const { name, value } = event.target;
    const newArr = relations;

    newArr[index] = { ...newArr[index], [name]: value };

    handleChangeArr('relations', newArr);
  };

  const updateChartDropdown = (event, index) => {
    const newArr = relations;
    const { chartID: mappedChart } = charts.find(({ chartID }) => chartID === event.target.value);

    newArr[index] = { ...newArr[index], mappedChart };

    handleChangeArr('relations', newArr);
  };

  // Get parameter fields for relations
  const fields = sourceType === 'ecl' ? schema : datasetFields;

  return dataset || eclDataset ? (
    charts.length === 0 ? (
      <Typography variant='h6' color='inherit' align='center' className={typography}>
        Insufficient Number of Charts
      </Typography>
    ) : (
      <Grid container direction='row' spacing={1} className={grid}>
        {relations.map(({ mappedChart, mappedField, originField }, index) => {
          return (
            <Fragment key={index}>
              <Grid item xs={1}>
                <Button className={button} onClick={index === 0 ? addField : () => removeField(index)}>
                  {index === 0 ? <AddCircleIcon /> : <RemoveIcon />}
                </Button>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>Current Chart Field</InputLabel>
                  <Select
                    name='originField'
                    value={originField}
                    onChange={event => updateField(event, index)}
                  >
                    {fields.map(({ name }, index) => {
                      return (
                        <MenuItem key={index} value={name}>
                          {name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                {chartDropdown(charts, mappedChart, index, updateChartDropdown)}
              </Grid>
              <Grid item xs={4}>
                {fieldDropdown(charts, mappedChart, mappedField, index, updateField)}
              </Grid>
            </Fragment>
          );
        })}
      </Grid>
    )
  ) : (
    <Typography variant='h6' color='inherit' align='center' className={typography}>
      {getMessage(sourceType, false)}
    </Typography>
  );
};

export default RelationMapper;
