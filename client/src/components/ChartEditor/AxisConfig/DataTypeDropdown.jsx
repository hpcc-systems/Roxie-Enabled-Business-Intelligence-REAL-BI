import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import PropTypes from 'prop-types';

const DataTypeDropdown = props => {
  const { className, handleChange, label, name, value, valuesArr } = props;

  return (
    <FormControl className={className} fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select name={name} value={value} onChange={handleChange}>
        {valuesArr.map((value, index) => {
          return (
            <MenuItem key={index} value={value}>
              {value}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

DataTypeDropdown.defaultProps = {
  className: '',
  value: 'string',
};

DataTypeDropdown.propTypes = {
  className: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  valuesArr: PropTypes.array.isRequired,
};

export default DataTypeDropdown;
