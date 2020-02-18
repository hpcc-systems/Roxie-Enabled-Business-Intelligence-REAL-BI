import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Checkbox,
  CircularProgress,
  FormControl,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';

// Redux Actions
import { getQueryInfo } from '../../../features/query/actions';

// Create styles
const useStyles = makeStyles(() => ({
  formControl: { marginBottom: 24 },
}));

const QueryInfo = ({ dataset, dispatch, fields, handleChange, handleChangeObj, params, query }) => {
  const [loading, setLoading] = useState(true);
  const { clusterID } = useSelector(state => state.dashboard.dashboard);
  const { datasets, params: paramsData } = useSelector(state => state.query.query);
  const selectedDataset = datasets.filter(({ name }) => name === dataset)[0];
  const { formControl } = useStyles();

  // ComponentDidMount -> Get list of query datasets from hpcc
  useEffect(() => {
    // Check for populated query value
    if (query) {
      getQueryInfo(clusterID, query).then(action => {
        dispatch(action);

        setLoading(false);
      });
    }
  }, [clusterID, dispatch, query]);

  return loading ? (
    <CircularProgress />
  ) : (
    <FormControl className={formControl} fullWidth>
      {paramsData.length > 0 ? (
        <Fragment>
          <h3>Parameters</h3>
          {paramsData.map(({ name, type }, index) => {
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
