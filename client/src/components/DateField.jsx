import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DatePicker from 'react-date-picker';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  picker: {
    backgroundColor: '#fff',
    width: 168,
  },
  root: {
    maxWidth: 72,
    marginTop: theme.spacing(1.25),
    paddingLeft: theme.spacing(1),
  },
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

  let month;
  let day;
  let year;
  let date;

  if (value) {
    month = value[0].substring(0, 2);
    day = value[0].substring(3, 5);
    year = value[0].substring(6, 10);

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
