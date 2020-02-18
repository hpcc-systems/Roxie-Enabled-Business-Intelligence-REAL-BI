import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

// Redux Actions
import { getQueryInfo } from '../../../features/query/actions';

// Create styles
const useStyles = makeStyles(() => ({
  formControl: { marginBottom: 24 },
}));

const SelectDataset = ({ dataset, dispatch, handleChange, query }) => {
  const [loading, setLoading] = useState(true);
  const { clusterID } = useSelector(state => state.dashboard.dashboard);
  const { datasets } = useSelector(state => state.query.query);
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
      <InputLabel>Query Datasets</InputLabel>
      <Select name="dataset" value={dataset} onChange={handleChange}>
        {datasets.map(({ name }, index) => {
          return (
            <MenuItem key={index} value={name}>
              {name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default SelectDataset;
