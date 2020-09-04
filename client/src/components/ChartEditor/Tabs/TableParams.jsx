import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, FormControl, Grid, Input, InputLabel, MenuItem, Select } from '@material-ui/core';

// Utils
import { getMessage } from '../../../utils/misc';

const useStyles = makeStyles(theme => ({
  formControl: { margin: `${theme.spacing(1)}px 0` },
  progress: { margin: 0, marginTop: 50 },
}));

const TableParams = ({ eclRef, handleChangeObj, localState }) => {
  const { schema = [] } = eclRef.current;
  const { chartID, config, selectedDataset = {}, sourceType } = localState;
  const { fields = [] } = selectedDataset;
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

  const fieldsArr =
    schema.length > 0 ? schema : !fields ? [{ name: getMessage(sourceType), value: '' }] : fields;
  const alteredFieldsArr = fieldsArr.filter(({ name }) => name !== checkboxValueField);
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
            value={checkboxValueField}
            onChange={handlecheckboxValueField}
          >
            {fieldsArr.map(({ name }, index) => {
              return (
                <MenuItem key={index} value={name}>
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
            value={alteredSelectedFieldsArr}
            input={<Input />}
            onChange={updateArr}
          >
            {alteredFieldsArr.map(({ name }, index) => {
              return (
                <MenuItem key={index} value={name}>
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
