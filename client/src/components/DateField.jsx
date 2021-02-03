import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker } from '@material-ui/pickers';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  picker: {
    maxWidth: 150,
    '& label': { color: theme.palette.primary.contrastText },
    '& .MuiInput-underline:before': { borderBottomColor: theme.palette.primary.contrastText },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottomColor: theme.palette.primary.contrastText,
    },
    '& .MuiInputBase-root > input': { color: theme.palette.primary.contrastText },
    '& .MuiButtonBase-root': { color: theme.palette.primary.contrastText },
  },
  root: { paddingLeft: theme.spacing(1) },
}));

const DateField = ({ filterID, name, value, valueObj, onChange }) => {
  const date = moment(value);
  const [isValid, setIsValid] = useState(value ? date.isValid() : true);
  const { picker, root } = useStyles();

  const handlePickerChange = value => {
    const date = moment(value);
    if (date == null || !date.isValid()) {
      return setIsValid(false);
    }

    const event = { target: { value } };
    onChange(event, valueObj, filterID);
  };

  return (
    <div className={root}>
      <KeyboardDatePicker
        classes={{ root: picker }}
        disableToolbar
        variant='inline'
        format='MM/dd/yyyy'
        margin='normal'
        label={name}
        value={value}
        onChange={(date, value) => handlePickerChange(value)}
        autoOk
        error={!isValid}
        invalidDateMessage={!isValid && 'Invalid Date Format'}
      />
    </div>
  );
};

export default DateField;
