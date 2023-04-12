import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import { getDateParts } from '../utils/misc';

const useStyles = makeStyles(theme => ({
  picker: {
    backgroundColor: '#fff',
    width: 168,
    fontSize: 18,
  },
  root: { marginTop: theme.spacing(1.25), paddingLeft: theme.spacing(1) },
  typography: { color: theme.palette.primary.contrastText },
}));

const DateField = ({ filterID, name, value, valueObj, onChange }) => {
  const { picker, root, typography } = useStyles();

  const handlePickerChange = value => {
    const date = moment(value);

    if (date.isValid()) {
      const event = { target: { value: date.format('L') } };
      onChange(event, valueObj, filterID);
    } else if (!value) {
      const event = { target: { value } };
      onChange(event, valueObj, filterID);
    }
  };

  let date;

  if (value[0]) {
    const { month, day, year } = getDateParts(value[0]);
    date = new Date(year, month - 1, day);
  }

  return (
    <div className={root}>
      <Typography className={typography} variant='subtitle2'>
        {name}
      </Typography>
      <DatePicker
        className={picker}
        format='MM/dd/y'
        locale='en-US'
        onChange={handlePickerChange}
        value={date}
      />
    </div>
  );
};

export default DateField;
