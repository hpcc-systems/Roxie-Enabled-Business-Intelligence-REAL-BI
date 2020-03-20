import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: { margin: `${theme.spacing(1)}px 0`, marginTop: 25 },
  formControl2: { margin: `${theme.spacing(2)}px 0` },
  typography: { marginTop: 20 },
}));

const GroupByTab = ({ handleChangeObj, localState }) => {
  const {
    dataset,
    groupBy: { column, row, value },
    selectedDataset,
  } = localState;
  const { fields = [{ name: 'Choose a dataset', value: '' }] } = selectedDataset;
  const { formControl, formControl2, typography } = useStyles();

  return dataset ? (
    <Fragment>
      <FormControl className={formControl} fullWidth>
        <InputLabel>Row</InputLabel>
        <Select name="groupBy:row" value={row} onChange={handleChangeObj}>
          {row !== '' && <MenuItem value={''}>Clear Selection</MenuItem>}
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
        <Select name="groupBy:column" value={column} onChange={handleChangeObj}>
          {column !== '' && <MenuItem value={''}>Clear Selection</MenuItem>}
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
        <Select name="groupBy:value" value={value} onChange={handleChangeObj}>
          {value !== '' && <MenuItem value={''}>Clear Selection</MenuItem>}
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
  ) : (
    <Typography variant="h6" color="inherit" align="center" className={typography}>
      Choose a dataset
    </Typography>
  );
};

export default GroupByTab;
