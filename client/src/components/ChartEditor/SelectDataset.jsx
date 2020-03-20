import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

// Utils
import { getQueryInfo } from '../../utils/query';

// Create styles
const useStyles = makeStyles(theme => ({
  formControl: { margin: `${theme.spacing(1)}px 0 ${theme.spacing(4)}px 0` },
  progress: { margin: `${theme.spacing(1)}px 0` },
}));

const SelectDataset = ({ dashboard, handleChange, localState }) => {
  const [loading, setLoading] = useState(false);
  const { chartID, dataset, datasets = [], selectedQuery } = localState;
  const { clusterID } = dashboard;
  const { formControl, progress } = useStyles();

  // Get list of query datasets from hpcc
  useEffect(() => {
    if (Object.keys(selectedQuery).length > 0) {
      setLoading(true);

      getQueryInfo(clusterID, selectedQuery).then(({ datasets, params }) => {
        handleChange(null, { name: 'datasets', value: datasets });

        if (!chartID) {
          // Populate paramArr with each param provided by the query
          const paramArr = params.map(param => ({ ...param, dataset: '', value: '' }));

          handleChange(null, { name: 'params', value: paramArr });
        }

        setLoading(false);
      });
    }
  }, [chartID, clusterID, handleChange, selectedQuery]);

  useEffect(() => {
    if (datasets.length > 0 && dataset) {
      let selectedDataset = datasets.filter(({ name }) => name === dataset)[0];

      handleChange(null, { name: 'selectedDataset', value: selectedDataset });
    }
  }, [dataset, datasets, handleChange]);

  // Do not show if in edit mode (chart ID populated)
  // Continue to mount component to get useEffect to run
  return (
    !chartID &&
    (loading ? (
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
    ))
  );
};

export default SelectDataset;
