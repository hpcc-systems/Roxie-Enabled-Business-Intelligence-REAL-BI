import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: { margin: `${theme.spacing(1)}px 0` },
  progress: { margin: 0, marginTop: 50 },
}));

// Changes message based on source type
const getMsg = sourceType => {
  return sourceType === 'file' ? 'Choose a file' : 'Choose a dataset';
};

const TableParams = ({ handleChangeObj, localState }) => {
  const { chartID, options, selectedDataset = {}, sourceType } = localState;
  const { fields = [{ name: getMsg(sourceType), value: '' }] } = selectedDataset;
  const { fields: optionsFields = [], checkboxValueField = '' } = options;
  const { formControl, progress } = useStyles();

  const getNewArray = (uniqueVal, newVals) => {
    const otherFields = newVals.filter(field => field !== uniqueVal);
    let newArr;

    if (otherFields.length > 0) {
      newArr = [uniqueVal, ...otherFields];
    } else if (uniqueVal !== '') {
      newArr = [uniqueVal];
    } else {
      newArr = [];
    }

    return newArr;
  };

  const updateArr = ({ target }) => {
    const { name, value } = target;
    const arr = getNewArray(checkboxValueField, value);

    handleChangeObj(null, { name, value: arr });
  };

  const handlecheckboxValueField = ({ target }) => {
    const { name, value } = target;

    // Update options:checkboxValueField
    handleChangeObj(null, { name, value: value });

    // Build new fields list array
    const arr = getNewArray(value, optionsFields);

    // Update options:fields
    handleChangeObj(null, { name: 'options:fields', value: arr });
  };

  const alteredFieldsArr = fields.filter(({ name }) => name !== checkboxValueField);
  const alteredSelectedFieldsArr = optionsFields.filter(field => field !== checkboxValueField);

  return (
    <Fragment>
      <FormControl className={formControl} fullWidth>
        <InputLabel>Checkbox Value Field</InputLabel>
        {chartID && fields.length <= 1 ? (
          <CircularProgress className={progress} size={20} />
        ) : (
          <Select
            name='options:checkboxValueField'
            value={options.checkboxValueField || ''}
            onChange={handlecheckboxValueField}
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
      <FormControl className={formControl} fullWidth>
        <TextField
          fullWidth
          label='Rename Checkbox Value'
          name='options:xAxis_Label'
          value={options.xAxis_Label || ''}
          onChange={handleChangeObj}
          autoComplete='off'
        />
      </FormControl>
      <FormControl className={formControl} fullWidth>
        <InputLabel>Other Fields</InputLabel>
        {chartID && fields.length <= 1 ? (
          <CircularProgress className={progress} size={20} />
        ) : (
          <Select
            multiple
            name='options:fields'
            value={alteredSelectedFieldsArr || []}
            input={<Input />}
            onChange={updateArr}
          >
            {alteredFieldsArr.map(({ name, value = name }, index) => {
              return (
                <MenuItem key={index} value={value}>
                  {name}
                </MenuItem>
              );
            })}
          </Select>
        )}
      </FormControl>
      <FormControl className={formControl} fullWidth>
        <TextField
          fullWidth
          label='Rename Other Fields'
          name='options:yAxis_Label'
          value={options.yAxis_Label || ''}
          onChange={handleChangeObj}
          autoComplete='off'
        />
      </FormControl>
    </Fragment>
  );
};

export default TableParams;
