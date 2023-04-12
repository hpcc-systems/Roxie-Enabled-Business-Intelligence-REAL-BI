import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  checkbox: {
    [theme.breakpoints.down('md')]: {
      margin: 0,
      padding: 0,
      '& span': {
        padding: '3px 0 0',
      },
    },
  },
}));

export default function Checkboxes({ disabled, value, updateField, index }) {
  const handleChange = event => {
    updateField(event, index);
  };
  const classes = useStyles();
  return (
    <>
      <Checkbox
        disabled={disabled}
        checked={disabled ? false : value}
        name='asLink'
        onChange={handleChange}
        className={classes.checkbox}
      />
      <span>Show as a link</span>
    </>
  );
}
