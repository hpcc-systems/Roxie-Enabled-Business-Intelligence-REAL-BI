import React, { Fragment, useEffect } from 'react';
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

// Redux Actions
import { getQueryInfo } from '../../../features/query/actions';

// Create styles
const useStyles = makeStyles(() => ({
  formControl: { marginBottom: 24 },
}));

const QueryInfo = ({ dispatch, fields, handleChange, handleChangeObj, params, query }) => {
  const {
    dashboard: { clusterID },
  } = useSelector(state => state.dashboard);
  const { query: queryData } = useSelector(state => state.query);
  const { formControl } = useStyles();

  // ComponentDidMount -> Get list of queries from hpcc based on keyword provided
  useEffect(() => {
    getQueryInfo(clusterID, query).then(action => dispatch(action));
  }, [clusterID, dispatch, query]);

  return (
    Object.keys(queryData).length > 0 && (
      <FormControl className={formControl} fullWidth>
        {queryData.params.length > 0 ? (
          <Fragment>
            <h3>Parameters</h3>
            {queryData.params.map(({ name, type }, index) => {
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
            {queryData.fields.map(({ name, type }, index) => {
              return (
                <MenuItem key={index} value={name}>
                  <Checkbox checked={fields.indexOf(name) > -1} />
                  <ListItemText primary={`${name}: ${type}`} />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </FormControl>
    )
  );
};

export default QueryInfo;
