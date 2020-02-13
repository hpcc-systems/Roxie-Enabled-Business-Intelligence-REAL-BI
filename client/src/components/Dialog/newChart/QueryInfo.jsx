import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Checkbox,
  FormControl,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';

// Create styles
const useStyles = makeStyles(() => ({
  formControl: { marginBottom: 24 },
}));

const QueryInfo = ({ dataset, fields, handleChange, handleChangeObj, params }) => {
  const { datasets, params: storeParams } = useSelector(state => state.query.query);
  const selectedDataset = datasets.filter(({ name }) => name === dataset)[0];
  const { formControl } = useStyles();

  return (
    <FormControl className={formControl} fullWidth>
      {storeParams.length > 0 ? (
        <Fragment>
          <h3>Parameters</h3>
          {storeParams.map(({ name, type }, index) => {
            return (
              <TextField
                key={index}
                label={`${name}: ${type}`}
                name={`params:${name}`}
                // Ternary is here to prevent error of input switching from uncontrolled to controlled
                value={params[name] === undefined ? '' : params[name]}
                onChange={handleChangeObj}
                autoComplete="off"
              />
            );
          })}
        </Fragment>
      ) : (
        <p>No Parameters</p>
      )}
      <h3>Fields</h3>
      <FormControl>
        <InputLabel>Fields</InputLabel>
        <Select
          multiple
          value={fields}
          onChange={handleChange}
          input={<Input />}
          renderValue={selected => selected.sort().join(', ')}
          name="fields"
        >
          {selectedDataset.fields.map(({ name, type }, index) => {
            return (
              <MenuItem key={index} value={name}>
                <Checkbox color="primary" checked={fields.indexOf(name) > -1} />
                <ListItemText primary={`${name}: ${type}`} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </FormControl>
  );
};

export default QueryInfo;
