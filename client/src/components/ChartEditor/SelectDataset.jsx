import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';

// Utils
import { getDatasetsFromSource } from '../../utils/hpcc';

// Create styles
const useStyles = makeStyles(theme => ({
  formControl: { marginBottom: theme.spacing(2), marginTop: theme.spacing(1) },
  progress: { margin: `${theme.spacing(1)}px 0` },
  errorText: { color: theme.palette.error.dark },
}));

const SelectDataset = ({ dashboard, handleChange, formFieldsUpdate, handleChangeObj, localState }) => {
  const [loading, setLoading] = useState(false);
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
  const { isStatic = false, type } = configuration;
  const { id: clusterID } = dashboard.cluster;
  const { formControl, progress, errorText } = useStyles();

  useEffect(() => {
    if (Object.keys(selectedSource).length > 0) {
      (async () => {
        setLoading(true);

        try {
          const data = await getDatasetsFromSource(clusterID, selectedSource, sourceType);
          const { datasets, fields, name, params: dataParams = [] } = data;

          if (sourceType === 'file') {
            formFieldsUpdate({ selectedDataset: { name, fields }, dataset: name, error: '' });
          } else {
            formFieldsUpdate({ datasets: datasets, error: '' });
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

        setLoading(false);
      })();
    }
  }, [chartID, clusterID, handleChange, handleChangeObj, selectedSource, sourceType]);

  useEffect(() => {
    if (datasets.length > 0 && dataset) {
      let selectedDataset = datasets.find(({ name }) => name === dataset);
      selectedDataset = selectedDataset ? selectedDataset : {};

      handleChange(null, { name: 'selectedDataset', value: selectedDataset });
    }
  }, [dataset, datasets, handleChange, handleChangeObj]);

  /*
    Don't render component to screen
    Still mount the component so the useEffect runs
  */
  if (sourceType === 'file' || (type === 'textBox' && isStatic)) {
    return null;
  }

  const selectedDatasetErr = errors.find(err => err['selectedDataset']);

  return loading ? (
    <CircularProgress className={progress} />
  ) : (
    <FormControl className={formControl} fullWidth>
      <InputLabel>Dataset</InputLabel>
      <Select name='dataset' value={dataset} onChange={handleChange} error={selectedDatasetErr !== undefined}>
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
