import React from 'react';
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

const DateRange = ({ filterID, valueObj, values: propVals, onChange }) => {
  const min = propVals[0] || new Date().toDateString();
  const max = propVals[1] || new Date().toDateString();
  const initState = [moment(min).format('L'), moment(max).format('L')];
  const [values, setValues] = React.useState(initState);
  const { picker, root } = useStyles();

  const handlePickerChange = (date, index) => {
    const newValues = [...values];
    newValues[index] = date;
    setValues(newValues);

    if (moment(newValues[0]).isValid() && moment(newValues[1]).isValid()) {
      const event = { target: { value: newValues } };
      onChange(event, valueObj, filterID);
    }
  };

  return (
    <div className={root}>
      {[0, 1].map(i => {
        return (
          <div key={i}>
            <KeyboardDatePicker
              classes={{ root: picker }}
              disableToolbar
              variant='inline'
              format='MM/dd/yyyy'
              margin='normal'
              label={i === 0 ? 'Start Date' : 'End Date'}
              value={values[i]}
              onChange={(date, value) => handlePickerChange(value, i)}
              autoOk
            />
          </div>
        );
      })}
    </div>
  );
};

export default DateRange;
