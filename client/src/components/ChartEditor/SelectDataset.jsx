import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';

// Utils
import { getDatasetsFromSource } from '../../utils/hpcc';

// Create styles
const useStyles = makeStyles(theme => ({
  formControl: { marginBottom: theme.spacing(2) },
  errorText: { color: theme.palette.error.dark },
}));

const SelectDataset = ({ dashboard, handleChange, formFieldsUpdate, handleChangeObj, localState }) => {
  const {
    chartID,
    configuration,
    errors,
    dataset,
    datasets = [],
    params,
    selectedSource = {},
    sourceType,
  } = localState;

  let selectedDataset = localState.selectedDataset;

  const { isStatic = false } = configuration;
  const { id: clusterID } = dashboard.cluster;
  const { formControl, errorText } = useStyles();

  useEffect(() => {
    if (Object.keys(selectedSource).length > 0) {
      (async () => {
        try {
          formFieldsUpdate({ selectedDataset: { loading: true, name: '', fields: [] } });

          const data = await getDatasetsFromSource(
            clusterID,
            selectedSource,
            sourceType,
            dashboard.accessOnBehalf,
          );
          const { datasets, fields, name, params: dataParams = [] } = data;

          if (sourceType === 'file') {
            formFieldsUpdate({ selectedDataset: { name, fields, loading: false }, dataset: name, error: '' });
          } else {
            if (chartID) {
              selectedDataset = datasets.find(({ name }) => name === dataset);
            }
            formFieldsUpdate({
              selectedDataset: { ...selectedDataset, loading: false },
              datasets: datasets,
              error: '',
            });
          }

          if (!chartID) {
            handleChange(null, { name: 'params', value: dataParams });
          } else {
            const newParams = dataParams.map(obj => {
              const foundIndex = params.findIndex(({ name }) => name === obj.name);

              if (foundIndex > -1) {
                obj = { ...obj, value: params[foundIndex].value, show: true };
              }

              return obj;
            });

            handleChange(null, { name: 'params', value: newParams });
          }
        } catch (error) {
          handleChange(null, { name: 'error', value: error.message });
        }
      })();
    }
  }, [chartID, clusterID, handleChange, handleChangeObj, selectedSource, sourceType]);

  /*
    Don't render component to screen
    Still mount the component so the useEffect runs
  */
  if (sourceType === 'file' || isStatic) {
    return null;
  }

  const selectDataset = event => {
    const selected = datasets.find(({ name }) => name === event.target.value);
    if (selected) {
      formFieldsUpdate({
        selectedDataset: { ...selected, loading: false },
        dataset: event.target.value,
      });
    }
  };

  const selectedDatasetErr = errors.find(err => err['selectedDataset']);

  return (
    <FormControl required className={formControl} fullWidth>
      <InputLabel>Dataset</InputLabel>
      <Select
        name='dataset'
        value={datasets.length > 0 ? dataset : ''}
        onChange={selectDataset}
        error={selectedDatasetErr !== undefined}
      >
        {selectedDataset.loading && (
          <MenuItem value='' disabled>
            <em>...loading options</em>
          </MenuItem>
        )}
        {datasets.length === 0 && !selectedDataset.loading && (
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
        )}
        {datasets.map(({ name }, index) => {
          return (
            <MenuItem key={index} value={name}>
              {name}
            </MenuItem>
          );
        })}
      </Select>
      {selectedDatasetErr !== undefined && (
        <FormHelperText className={errorText}>{selectedDatasetErr['selectedDataset']}</FormHelperText>
      )}
    </FormControl>
  );
};

export default SelectDataset;
