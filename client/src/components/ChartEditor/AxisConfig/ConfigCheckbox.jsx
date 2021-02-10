import React from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import PropTypes from 'prop-types';

const ConfigCheckbox = props => {
  const { className, checked, handleChange, label, labelPlacement, name } = props;

  return (
    <FormControlLabel
      className={className}
      control={<Checkbox name={name} checked={checked} onChange={handleChange} color='primary' />}
      label={label}
      labelPlacement={labelPlacement}
    />
  );
};

ConfigCheckbox.defaultProps = {
  className: '',
  checked: false,
};

ConfigCheckbox.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  labelPlacement: PropTypes.oneOf(['top', 'end']),
};

export default ConfigCheckbox;
