import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: { margin: `${theme.spacing(1)}px 0` },
  progress: { margin: 0, marginTop: 50 },
}));

const TableParams = ({ handleChangeObj, localState }) => {
  const { chartID, options, selectedDataset } = localState;
  const { fields = [{ name: 'Choose a dataset', value: '' }] } = selectedDataset;
  const { formControl, progress } = useStyles();

  // Update array in local state
  const updateArr = ({ target }) => {
    const { name, value } = target;

    handleChangeObj(null, { name, value });
  };

  return (
    <FormControl className={formControl} fullWidth>
      <InputLabel>Fields</InputLabel>
      {chartID && fields.length <= 1 ? (
        <CircularProgress className={progress} size={20} />
      ) : (
        <Select
          multiple
          name='options:fields'
          value={options.fields || []}
          input={<Input />}
          onChange={updateArr}
        >
          {fields.map(({ name, value = name }, index) => {
            return (
              <MenuItem key={index} value={value}>
                {name}
              </MenuItem>
            );
          })}
        </Select>
      )}
    </FormControl>
  );
};

export default TableParams;
