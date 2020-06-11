import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';

// React Components
import SourceSearch from './SourceSearch';
import SelectDataset from './SelectDataset';

// Constants
import { sourceOptions } from '../../constants';

const useStyles = makeStyles(theme => ({
  formControl: { margin: 0, marginTop: theme.spacing(1) },
}));

// Changes error message for dropdown
const getMsg = sourceType => {
  return sourceType === 'file' ? 'Error retrieving file metadata' : 'Choose a dataset';
};

const clearSelection = () => <MenuItem value=''>Clear Selection</MenuItem>;

const FilterInfo = ({ dashboard, handleChange, localState }) => {
  const { field, filterID, name, selectedDataset, sourceType } = localState;
  const { fields = [{ name: getMsg(sourceType), value: '' }] } = selectedDataset;
  const { formControl } = useStyles();

  const changeSourceType = event => {
    handleChange(null, { name: 'selectedSource', value: {} });
    handleChange(event);
  };

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
      {!filterID && (
        <FormControl fullWidth className={formControl}>
          <InputLabel>Source Type</InputLabel>
          <Select name='sourceType' value={sourceType} onChange={changeSourceType}>
            {sourceOptions.map((option, index) => {
              return (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}
      <SourceSearch dashboard={dashboard} handleChange={handleChange} localState={localState} />
      {(() => {
        switch (sourceType) {
          case 'file':
            return null;
          default:
            return (
              <SelectDataset dashboard={dashboard} handleChange={handleChange} localState={localState} />
            );
        }
      })()}
      {!filterID && (
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
      )}
    </Fragment>
  );
};

export default FilterInfo;
