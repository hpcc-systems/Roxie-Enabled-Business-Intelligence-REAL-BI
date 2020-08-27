import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, FormControl, Grid, Input, InputLabel, MenuItem, Select } from '@material-ui/core';

// Utils
import { getMessage } from '../../../utils/misc';

const useStyles = makeStyles(theme => ({
  formControl: { margin: `${theme.spacing(1)}px 0` },
  progress: { margin: 0, marginTop: 50 },
}));

const TableParams = ({ handleChangeObj, localState }) => {
  const { chartID, config, selectedDataset = {}, sourceType } = localState;
  const { fields = [{ name: getMessage(sourceType), value: '' }] } = selectedDataset;
  const { fields: configFields = [], checkboxValueField = '' } = config;
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

    // Update config:checkboxValueField
    handleChangeObj(null, { name, value: value });

    // Build new fields list array
    const arr = getNewArray(value, configFields);

    // Update config:fields
    handleChangeObj(null, { name: 'config:fields', value: arr });
  };

  const alteredFieldsArr = fields.filter(({ name }) => name !== checkboxValueField);
  const alteredSelectedFieldsArr = configFields.filter(field => field !== checkboxValueField);

  return (
    <Grid item md={12}>
      <FormControl className={formControl} fullWidth>
        <InputLabel>Checkbox Value Field</InputLabel>
        {chartID && fields.length <= 1 ? (
          <CircularProgress className={progress} size={20} />
        ) : (
          <Select
            name='config:checkboxValueField'
            value={config.checkboxValueField || ''}
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
        <InputLabel>Other Fields</InputLabel>
        {chartID && fields.length <= 1 ? (
          <CircularProgress className={progress} size={20} />
        ) : (
          <Select
            multiple
            name='config:fields'
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
    </Grid>
  );
};

export default TableParams;
