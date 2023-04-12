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
  const { filterParams } = localState;
  const { button } = useStyles();

  const removeField = paramName => {
    const newArr = [...filterParams];
    const index = newArr.findIndex(({ name }) => name === paramName);

    newArr[index] = { ...newArr[index], show: false, value: '' };

    handleChange(null, { name: 'filterParams', value: newArr });
  };

  const updateField = event => {
    const newArr = [...filterParams];
    const index = newArr.findIndex(({ name }) => name === event.target.value);

    newArr[index] = { ...newArr[index], show: true };

    handleChange(null, { name: 'filterParams', value: newArr });
  };

  const updateValueField = (event, paramName) => {
    const newArr = [...filterParams];
    const index = newArr.findIndex(({ name }) => name === paramName);

    newArr[index] = { ...newArr[index], value: event.target.value };

    handleChange(null, { name: 'filterParams', value: newArr });
  };

  // Show only certain params
  const partialParamsArr = filterParams.filter(({ name }) => name !== 'Start' && name !== 'Count');
  let selectedParams = partialParamsArr.filter(({ show = false }) => show);

  selectedParams = [...selectedParams, newParamEntry];

  return (
    <Fragment>
      {selectedParams.map(({ name, show = false, value }, index) => {
        return (
          <Fragment key={index}>
            {show && (
              <Grid item xs={1}>
                <Button className={button} onClick={() => removeField(name)}>
                  <RemoveIcon />
                </Button>
              </Grid>
            )}
            <Grid item xs={6}>
              {fieldDropdown(partialParamsArr, name, index, updateField)}
            </Grid>
            <Grid item xs={show ? 5 : 6}>
              {paramValueField(name, value, index, show ? updateValueField : () => {})}
            </Grid>
          </Fragment>
        );
      })}
    </Fragment>
  );
};

export default DynamicFileParams;
