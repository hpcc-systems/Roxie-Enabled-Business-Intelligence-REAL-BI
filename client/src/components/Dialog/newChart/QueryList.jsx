import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

// Redux Actions
import { getQueries } from '../../../features/query/actions';

const useStyles = makeStyles(() => ({
  formControl: { marginBottom: 24 },
}));

const QueryList = ({ dispatch, handleChange, keyword, query }) => {
  const {
    dashboard: { clusterID },
  } = useSelector(state => state.dashboard);
  const { queries } = useSelector(state => state.query);
  const { formControl } = useStyles();

  // ComponentDidMount -> Get list of queries from hpcc based on keyword provided
  useEffect(() => {
    const getQueryList = async () => {
      return await getQueries(clusterID, keyword);
    };

    getQueryList().then(action => dispatch(action));
  }, [clusterID, dispatch, keyword]);

  return (
    <FormControl className={formControl} fullWidth>
      <InputLabel>HPCC Query</InputLabel>
      <Select name="query" value={query} onChange={handleChange}>
        {queries.map(({ id, name, querySet }) => {
          return (
            <MenuItem key={id} value={querySet}>
              {name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default QueryList;
