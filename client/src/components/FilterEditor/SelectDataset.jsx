import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

// Utils
import { getSourceInfo } from '../../utils/source';

// Create styles
const useStyles = makeStyles(theme => ({
  formControl: { margin: 0, marginTop: theme.spacing(1) },
  progress: { margin: `${theme.spacing(1)}px 0` },
}));

const SelectDataset = ({ dashboard, handleChange, localState }) => {
  const [loading, setLoading] = useState(false);
  const { dataset, datasets = [], filterID, selectedSource = {}, sourceType } = localState;
  const { clusterID } = dashboard;
  const { formControl, progress } = useStyles();

  // Get list of source datasets from hpcc
  useEffect(() => {
    if (Object.keys(selectedSource).length > 0) {
      setLoading(true);

      getSourceInfo(clusterID, selectedSource, sourceType).then(({ datasets }) => {
        handleChange(null, { name: 'datasets', value: datasets });

        setLoading(false);
      });
    }
  }, [clusterID, handleChange, selectedSource, sourceType]);

  useEffect(() => {
    if (datasets.length > 0 && dataset) {
      let selectedDataset = datasets.find(({ name }) => name === dataset);
      selectedDataset = selectedDataset ? selectedDataset : {};

      handleChange(null, { name: 'selectedDataset', value: selectedDataset });
    }
  }, [dataset, datasets, handleChange]);

  return (
    !filterID &&
    (loading ? (
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
    ))
  );
};

export default SelectDataset;
