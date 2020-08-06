import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { AddCircle as AddCircleIcon, Remove as RemoveIcon } from '@material-ui/icons';

// Create styles
const useStyles = makeStyles(theme => ({
  button: {
    margin: 0,
    marginTop: theme.spacing(3),
    minWidth: 30,
    padding: 0,
  },
}));

// React Components
const clearSelection = () => <MenuItem value=''>Clear Selection</MenuItem>;

// Dropdown component to choose from a list of charts on the dashboard
const fieldDropdown = (arr, field, index, updateArr) => (
  <FormControl fullWidth>
    <InputLabel>Field</InputLabel>
    <Select name='name' value={field || ''} onChange={event => updateArr(event, index)}>
      {field !== '' ? clearSelection() : null}
      {arr.map(({ name }, index) => {
        return (
          <MenuItem key={index} value={name}>
            {name}
          </MenuItem>
        );
      })}
    </Select>
  </FormControl>
);

// Textfield component to update parameter value
const paramValueField = (value, index, updateValue) => {
  return (
    <TextField
      label='Value'
      name='value'
      value={value || ''}
      onChange={event => updateValue(event, index)}
      fullWidth
    />
  );
};

// Constants
const templateObj = { name: '', value: '' };

const DynamicFileParams = ({ handleChangeArr, localState }) => {
  const { config, mappedParams = [] } = localState;
  const { params = [] } = config;
  const { button } = useStyles();

  const addField = () => {
    // Adds additional template object to array
    handleChangeArr('mappedParams', [...mappedParams, templateObj]);
  };

  const removeField = index => {
    const newArr = mappedParams;

    // Remove index
    newArr.splice(index, 1);

    // Update local state
    handleChangeArr('mappedParams', newArr);
  };

  const updateFieldDropdown = ({ target }, index) => {
    const { value: fieldName } = target;
    const newArr = mappedParams;

    // Field selection cleared
    if (fieldName === '') {
      // Remove index
      newArr.splice(index, 1);

      if (newArr.length === 0) {
        newArr.push([templateObj]);
      }

      return handleChangeArr('mappedParams', newArr);
    }

    // Get matched parameter object from original array
    const { name, ...otherKeys } = params.find(({ name }) => name === fieldName); // Add source info to new array

    // Update copied array at necessary index
    newArr[index] = { name, value: '', ...otherKeys };

    // Update local state
    handleChangeArr('mappedParams', newArr);
  };

  const updateValueField = ({ target }, index) => {
    const { value } = target;
    const newArr = mappedParams;

    // Update copied array at necessary index
    newArr[index] = { ...newArr[index], value };

    // Update local state
    handleChangeArr('mappedParams', newArr);
  };

  // Show only certain params
  const partialParamsArr = params.filter(({ name }) => name !== 'Start' && name !== 'Count');

  return (
    <Fragment>
      {mappedParams.length === 1
        ? (() => {
            const index = 0;
            const { name, value } = mappedParams[index];

            return (
              <Fragment>
                <Grid item xs={1}>
                  <Button className={button} onClick={addField}>
                    <AddCircleIcon />
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  {fieldDropdown(partialParamsArr, name, index, updateFieldDropdown)}
                </Grid>
                <Grid item xs={5}>
                  {paramValueField(value, index, updateValueField)}
                </Grid>
              </Fragment>
            );
          })()
        : mappedParams.map((obj, index) => {
            const { name, value } = obj;

            return (
              <Fragment key={index}>
                <Grid item xs={1}>
                  <Button className={button} onClick={index === 0 ? addField : () => removeField(index)}>
                    {index === 0 ? <AddCircleIcon /> : <RemoveIcon />}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  {fieldDropdown(partialParamsArr, name, index, updateFieldDropdown)}
                </Grid>
                <Grid item xs={5}>
                  {paramValueField(value, index, updateValueField)}
                </Grid>
              </Fragment>
            );
          })}
    </Fragment>
  );
};

export default DynamicFileParams;
