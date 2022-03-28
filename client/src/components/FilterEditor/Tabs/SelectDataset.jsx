import React, { useEffect } from 'react';
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

const SelectDataset = ({ dashboard, handleChange, localState, formFieldsUpdate }) => {
  const {
    datasets = [],
    filterID,
    filterParams = [],
    errors,
    sourceDataset,
    selectedDataset,
    selectedSource = {},
    sourceType,
  } = localState;

  const { id: clusterID } = dashboard.cluster;
  const { errorText, progress } = useStyles();

  // Get list of sources datasets from hpcc
  useEffect(() => {
    if (Object.keys(selectedSource).length > 0) {
      (async () => {
        formFieldsUpdate({ selectedDataset: { loading: true, name: '', fields: [] } });

        try {
          const data = await getDatasetsFromSource(
            clusterID,
            selectedSource,
            sourceType,
            dashboard.accessOnBehalf,
          );
          const { datasets, fields, name, params: dataParams = [] } = data;

          if (sourceType === 'file') {
            formFieldsUpdate({
              selectedDataset: { name, fields, loading: false },
              isFilterReady: true,
              dataset: name,
              error: '',
            });
          } else {
            formFieldsUpdate({
              selectedDataset: { ...selectedDataset, loading: false },
              isFilterReady: true,
              datasets: datasets,
              error: '',
            });
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
      })();
    }
  }, [clusterID, handleChange, selectedSource, sourceType]);

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
      {selectedDataset.loading ? (
        <CircularProgress className={progress} />
      ) : (
        <FormControl fullWidth>
          <InputLabel>Dataset</InputLabel>
          <Select
            name='sourceDataset'
            value={sourceDataset}
            onChange={handleChange}
            disabled={!localState.isFilterReady}
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
