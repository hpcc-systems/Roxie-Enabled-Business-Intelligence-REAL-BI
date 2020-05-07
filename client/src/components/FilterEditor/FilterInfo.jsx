import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';

// React Components
import QuerySearch from './QuerySearch';
import SelectDataset from './SelectDataset';

const useStyles = makeStyles(theme => ({
  formControl: { margin: 0, marginTop: theme.spacing(1), marginBottom: theme.spacing(1) },
}));

const clearSelection = () => <MenuItem value=''>Clear Selection</MenuItem>;

const FilterInfo = ({ dashboard, handleChange, localState }) => {
  const { datasets, dataset, field, name } = localState;
  const { formControl } = useStyles();
  let fields = [{ name: 'Select Dataset', value: '' }];

  if (dataset) {
    fields = datasets.filter(({ name }) => name === dataset)[0].fields;
  }

  return (
    <Fragment>
      <TextField
        fullWidth
        label='Filter Name'
        name='name'
        value={name || ''}
        onChange={handleChange}
        autoComplete='off'
      />
      <QuerySearch dashboard={dashboard} handleChange={handleChange} localState={localState} />
      <SelectDataset dashboard={dashboard} handleChange={handleChange} localState={localState} />
      <FormControl fullWidth className={formControl}>
        <InputLabel>Field</InputLabel>
        <Select name='field' value={field || ''} onChange={handleChange}>
          {field !== '' ? clearSelection() : null}
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

export default FilterInfo;
