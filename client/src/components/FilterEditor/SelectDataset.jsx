import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

// Utils
import { getQueryInfo } from '../../utils/query';

// Create styles
const useStyles = makeStyles(theme => ({
  formControl: { margin: 0, marginTop: theme.spacing(1) },
  progress: { margin: `${theme.spacing(1)}px 0` },
}));

const SelectDataset = ({ dashboard, handleChange, localState }) => {
  const [loading, setLoading] = useState(false);
  const { dataset, datasets = [], query } = localState;
  const { clusterID } = dashboard;
  const { formControl, progress } = useStyles();

  // Get list of query datasets from hpcc
  useEffect(() => {
    if (Object.keys(query).length > 0) {
      setLoading(true);

      getQueryInfo(clusterID, query).then(({ datasets, params }) => {
        handleChange(null, { name: 'datasets', value: datasets });

        // Populate paramArr with each param provided by the query
        const paramArr = params.map(param => ({ ...param, dataset: '', value: '' }));

        handleChange(null, { name: 'params', value: paramArr });

        setLoading(false);
      });
    }
  }, [clusterID, handleChange, query]);

  return loading ? (
    <CircularProgress className={progress} />
  ) : (
    <FormControl className={formControl} fullWidth>
      <InputLabel>Dataset</InputLabel>
      <Select name='dataset' value={dataset} onChange={handleChange}>
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
