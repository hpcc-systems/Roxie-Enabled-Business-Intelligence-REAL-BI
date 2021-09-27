import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { Remove as RemoveIcon } from '@material-ui/icons';

// Create styles
const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(2.5, 0, 0, 1),
    minWidth: 30,
    padding: 0,
  },
}));

// Dropdown component to choose from a list of fields in the file
const fieldDropdown = (arr, field, index, updateArr) => (
  <FormControl fullWidth>
    <InputLabel>Field</InputLabel>
    <Select name='name' value={field || ''} onChange={updateArr}>
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
const paramValueField = (name, value, index, updateValue) => {
  return (
    <TextField
      label='Value'
      name='value'
      value={value || ''}
      onChange={event => updateValue(event, name)}
      fullWidth
    />
  );
};

// Constants
const newParamEntry = { name: '', value: '' };

const DynamicFileParams = ({ handleChange, localState }) => {
  const { params } = localState;
  const { button } = useStyles();

  const removeField = paramName => {
    const newArr = [...params];
    const index = newArr.findIndex(({ name }) => name === paramName);

    newArr[index] = { ...newArr[index], show: false, value: '' };

    handleChange(null, { name: 'params', value: newArr });
  };

  const updateField = event => {
    const newArr = [...params];
    const index = newArr.findIndex(({ name }) => name === event.target.value);

    newArr[index] = { ...newArr[index], show: true };

    handleChange(null, { name: 'params', value: newArr });
  };

  const updateValueField = (event, paramName) => {
    const newArr = [...params];
    const index = newArr.findIndex(({ name }) => name === paramName);

    newArr[index] = { ...newArr[index], value: event.target.value };

    handleChange(null, { name: 'params', value: newArr });
  };

  // Show only certain params
  const partialParamsArr = params.filter(({ name }) => name !== 'Start' && name !== 'Count');
  let selectedParams = partialParamsArr.filter(({ show = false }) => show);

  selectedParams = [...selectedParams, newParamEntry];

  return selectedParams.map(({ name, show = false, value }, index) => (
    <Fragment key={index}>
      <Grid item xs={2} lg={1}>
        {show && (
          <Button className={button} onClick={() => removeField(name)}>
            <RemoveIcon />
          </Button>
        )}
      </Grid>
      <Grid item xs={5} sm={4} lg={5}>
        {fieldDropdown(partialParamsArr, name, index, updateField)}
      </Grid>
      <Grid item xs={5} sm={6}>
        {paramValueField(name, value, index, show ? updateValueField : () => {})}
      </Grid>
    </Fragment>
  ));
};

export default DynamicFileParams;
