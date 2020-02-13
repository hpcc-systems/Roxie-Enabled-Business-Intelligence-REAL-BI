import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';

// Redux Actions
import { getQueries } from '../../../features/query/actions';

// Create styles
const useStyles = makeStyles(() => ({
  formControl: { marginBottom: 24 },
  typography: { fontSize: 20, paddingBottom: 20 },
}));

const QueryList = ({ dispatch, handleChange, keyword, query }) => {
  const [loading, setLoading] = useState(true);
  const {
    dashboard: { clusterID },
  } = useSelector(state => state.dashboard);
  const { queries } = useSelector(state => state.query);
  const { formControl, typography } = useStyles();

  // ComponentDidMount -> Get list of queries from hpcc based on keyword provided
  useEffect(() => {
    getQueries(clusterID, keyword).then(action => {
      dispatch(action);

      setLoading(false);
    });
  }, [clusterID, dispatch, keyword]);

  return loading ? (
    <CircularProgress />
  ) : queries.length > 0 ? (
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
  ) : (
    <Typography variant="h3" align="center" color="inherit" className={typography}>
      No queries available
    </Typography>
  );
};

export default QueryList;
