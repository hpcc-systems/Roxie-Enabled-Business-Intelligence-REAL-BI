import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: { margin: `${theme.spacing(1)}px 0`, marginTop: 25 },
  formControl2: { margin: `${theme.spacing(1)}px 0` },
}));

// A dropdown choice to clear the dropdown selection
const ClearSelect = () => <MenuItem value={''}>Clear Selection</MenuItem>;

const GroupByTab = ({ handleChangeObj, localState }) => {
  const { datasetObj, groupBy } = localState;
  const { fields = [{ name: 'Choose a dataset', value: '' }] } = datasetObj;
  const { formControl, formControl2 } = useStyles();

  return (
    <Fragment>
      <FormControl className={formControl} fullWidth>
        <InputLabel>Row</InputLabel>
        <Select
          name="groupBy:row"
          // Ternary is here to prevent error of input switching from uncontrolled to controlled
          value={groupBy.row === undefined ? '' : groupBy.row}
          onChange={handleChangeObj}
        >
          {fields.length > 1 ? ClearSelect() : null}
          {fields.map(({ name, value = name }, index) => {
            return (
              <MenuItem key={index} value={value}>
                {name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <FormControl className={formControl2} fullWidth>
        <InputLabel>Column</InputLabel>
        <Select
          name="groupBy:column"
          // Ternary is here to prevent error of input switching from uncontrolled to controlled
          value={groupBy.column === undefined ? '' : groupBy.column}
          onChange={handleChangeObj}
        >
          {fields.length > 1 ? ClearSelect() : null}
          {fields.map(({ name, value = name }, index) => {
            return (
              <MenuItem key={index} value={value}>
                {name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <FormControl className={formControl2} fullWidth>
        <InputLabel>Value</InputLabel>
        <Select
          name="groupBy:value"
          // Ternary is here to prevent error of input switching from uncontrolled to controlled
          value={groupBy.value === undefined ? '' : groupBy.value}
          onChange={handleChangeObj}
        >
          {fields.length > 1 ? ClearSelect() : null}
          {fields.map(({ name, value = name }, index) => {
            return (
              <MenuItem key={index} value={value}>
                {name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Fragment>
  );
};

export default GroupByTab;
