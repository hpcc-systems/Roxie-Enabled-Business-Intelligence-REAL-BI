import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';

// Utils
import { getDatasetsFromSource } from '../../../utils/hpcc';

// Create styles
const useStyles = makeStyles(theme => ({
  errorText: { color: theme.palette.error.dark },
  progress: { margin: `${theme.spacing(1)}px 0` },
}));

const SelectDataset = ({ dashboard, handleChange, localState }) => {
  const [loading, setLoading] = useState(false);
  const {
    datasets = [],
    filterID,
    filterParams = [],
    errors,
    sourceDataset,
    selectedSource = {},
    sourceType,
  } = localState;
  const { id: clusterID } = dashboard.cluster;
  const { errorText, progress } = useStyles();

  // Get list of sources datasets from hpcc
  useEffect(() => {
    if (Object.keys(selectedSource).length > 0) {
      (async () => {
        setLoading(true);

        try {
          const data = await getDatasetsFromSource(clusterID, selectedSource, sourceType);
          const { datasets, fields, name, params: dataParams = [] } = data;

          if (sourceType === 'file') {
            handleChange(null, { name: 'selectedDataset', value: { name, fields } });
            handleChange(null, { name: 'dataset', value: name });
          } else {
            handleChange(null, { name: 'datasets', value: datasets });
          }

          if (!filterID) {
            handleChange(null, { name: 'filterParams', value: dataParams });
          } else {
            const newParams = dataParams.map(obj => {
              const foundIndex = filterParams.findIndex(({ name }) => name === obj.name);

              if (foundIndex > -1) {
                obj = { ...obj, value: filterParams[foundIndex].value, show: true };
              }

              return obj;
            });

            handleChange(null, { name: 'filterParams', value: newParams });
          }
        } catch (error) {
          handleChange(null, { name: 'error', value: error.message });
        }

        setLoading(false);
      })();
    }
  }, [clusterID, handleChange, selectedSource, sourceType]);

  useEffect(() => {
    if (datasets.length > 0 && sourceDataset) {
      let selectedDataset = datasets.find(({ name }) => name === sourceDataset);
      selectedDataset = selectedDataset ? selectedDataset : {};

      handleChange(null, { name: 'selectedDataset', value: selectedDataset });
    }
  }, [datasets, handleChange, sourceDataset]);

  /*
    Don't render component to screen
    Still mount the component so the useEffect runs
  */
  if (sourceType === 'file') {
    return null;
  }

  const sourceDatasetErr = errors.find(err => err['selectedDataset']);

  return (
    <Grid item xs={12}>
      {loading ? (
        <CircularProgress className={progress} />
      ) : (
        <FormControl fullWidth>
          <InputLabel>Dataset</InputLabel>
          <Select
            name='sourceDataset'
            value={sourceDataset}
            onChange={handleChange}
            error={sourceDatasetErr !== undefined}
          >
            {datasets.map(({ name }, index) => {
              return (
                <MenuItem key={index} value={name}>
                  {name}
                </MenuItem>
              );
            })}
          </Select>
          {sourceDatasetErr !== undefined && (
            <FormHelperText className={errorText}>{sourceDatasetErr['selectedDataset']}</FormHelperText>
          )}
        </FormControl>
      )}
    </Grid>
  );
};

export default SelectDataset;
