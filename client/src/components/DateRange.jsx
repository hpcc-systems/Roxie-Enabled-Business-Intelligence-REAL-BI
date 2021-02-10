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
  pickerDiv: { margin: theme.spacing(1.5, 0) },
  root: { paddingLeft: theme.spacing(1) },
  typography: { color: theme.palette.primary.contrastText },
}));

const DateRange = ({ filterID, valueObj, values: propVals, onChange }) => {
  const initState = propVals[0] ? [...propVals] : new Array(2);
  const [values, setValues] = React.useState(initState);
  const { picker, pickerDiv, root, typography } = useStyles();

  const handlePickerChange = (value, i) => {
    let newValues = [...values];
    newValues[i] = moment(value).isValid() ? moment(value).format('L') : null;
    setValues(newValues);

    if (
      newValues.every(value => {
        if (value == null) {
          return true;
        }

        return moment(value).isValid();
      })
    ) {
      newValues = newValues.map(value => {
        if (value == null) {
          return value;
        }

        return moment(value).format('L');
      });

      const event = { target: { value: newValues } };
      onChange(event, valueObj, filterID);
    }
  };

  let startDate;
  let endDate;

  if (values[0]) {
    const { month, day, year } = getDateParts(values[0]);
    startDate = new Date(year, month - 1, day);
  }

  if (values[1]) {
    const { month, day, year } = getDateParts(values[1]);
    endDate = new Date(year, month - 1, day);
  }

  return (
    <div className={root}>
      <div className={pickerDiv}>
        <Typography className={typography} variant='subtitle2'>
          Start Date
        </Typography>
        <DatePicker
          className={picker}
          format='MM/dd/y'
          locale='en-US'
          onChange={value => handlePickerChange(value, 0)}
          value={startDate}
        />
      </div>

      <div className={pickerDiv}>
        <Typography className={typography} variant='subtitle2'>
          End Date
        </Typography>
        <DatePicker
          className={picker}
          format='MM/dd/y'
          locale='en-US'
          onChange={value => handlePickerChange(value, 1)}
          value={endDate}
        />
      </div>
    </div>
  );
};

export default DateRange;
