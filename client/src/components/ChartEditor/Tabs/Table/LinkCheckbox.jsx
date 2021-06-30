import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

export default function Checkboxes({ disabled, value, updateField, index }) {
  const handleChange = event => {
    updateField(event, index);
  };

  return (
    <>
      <Checkbox
        disabled={disabled}
        checked={disabled ? false : value}
        name='asLink'
        onChange={handleChange}
      />
      <span>Show as a link</span>
    </>
  );
}
