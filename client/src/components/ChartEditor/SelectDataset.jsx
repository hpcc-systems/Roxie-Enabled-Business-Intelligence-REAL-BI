import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

// Utils
import { getSourceInfo } from '../../utils/source';

// Create styles
const useStyles = makeStyles(theme => ({
  formControl: { marginBottom: theme.spacing(2), marginTop: theme.spacing(1) },
  progress: { margin: `${theme.spacing(1)}px 0` },
}));

const SelectDataset = ({ dashboard, handleChange, localState }) => {
  const [loading, setLoading] = useState(false);
  const { charts } = useSelector(state => state.chart);
  const { chartID, dataset, datasets = [], selectedSource = {}, sourceType } = localState;
  const { clusterID } = dashboard;
  const { formControl, progress } = useStyles();

  // Get list of sources datasets from hpcc
  useEffect(() => {
    if (Object.keys(selectedSource).length > 0) {
      setLoading(true);

      getSourceInfo(clusterID, selectedSource, sourceType).then(data => {
        const { datasets, fields, name, params = [] } = data;

        if (sourceType === 'file') {
          handleChange(null, { name: 'selectedDataset', value: { name, fields } });
          handleChange(null, { name: 'dataset', value: name });
        } else {
          handleChange(null, { name: 'datasets', value: datasets });
        }

        if (!chartID) {
          handleChange(null, { name: 'params', value: params });
        }

        setLoading(false);
      });
    }
  }, [chartID, charts, clusterID, handleChange, selectedSource, sourceType]);

  useEffect(() => {
    if (datasets.length > 0 && dataset) {
      let selectedDataset = datasets.find(({ name }) => name === dataset);
      selectedDataset = selectedDataset ? selectedDataset : {};

      handleChange(null, { name: 'selectedDataset', value: selectedDataset });
    }
  }, [dataset, datasets, handleChange]);

  return (
    sourceType !== 'file' &&
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
