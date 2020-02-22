import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

// Redux Actions
import { getQueryInfo } from '../../features/query/actions';

// Create styles
const useStyles = makeStyles(theme => ({
  formControl: { margin: `${theme.spacing(1)}px 0`, marginBottom: 40 },
  progress: { margin: `${theme.spacing(1)}px 0`, marginBottom: 40 },
}));

const SelectDataset = ({ dispatch, handleChange, localState, resetState }) => {
  const [loading, setLoading] = useState(false);
  const { clusterID } = useSelector(state => state.dashboard.dashboard);
  const { datasets = [], params } = useSelector(state => state.query.query);
  const { dataset, query } = localState;
  const { formControl, progress } = useStyles();

  // ComponentDidMount -> Get list of query datasets from hpcc
  useEffect(() => {
    if (query) {
      setLoading(true);

      // Query changed, clear dataset value
      handleChange({ target: { name: 'dataset', value: '' } });

      getQueryInfo(clusterID, query).then(action => {
        dispatch(action);

        setLoading(false);
      });
    }
  }, [clusterID, dispatch, handleChange, query]);

  useEffect(() => {
    if (dataset) {
      const selectedDataset = datasets.filter(({ name }) => name === dataset)[0];
      const datasetObj = { params, ...selectedDataset };

      // Partially reset state -> clear chart axes, title and params
      resetState(prevState => ({ ...prevState, config: {}, params: {} }));

      // Set datasetObj
      handleChange({ target: { name: 'datasetObj', value: datasetObj } });
    }
  }, [dataset, datasets, handleChange, params, resetState]);

  return loading ? (
    <CircularProgress className={progress} />
  ) : (
    <FormControl className={formControl} fullWidth>
      <InputLabel>Dataset</InputLabel>
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
