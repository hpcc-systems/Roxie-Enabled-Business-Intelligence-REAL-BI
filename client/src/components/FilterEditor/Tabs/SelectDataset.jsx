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
import { getSourceInfo } from '../../../utils/source';

// Create styles
const useStyles = makeStyles(theme => ({
  errorText: { color: theme.palette.error.dark },
  progress: { margin: `${theme.spacing(1)}px 0` },
}));

const SelectDataset = ({ dashboard, handleChange, handleChangeObj, localState }) => {
  const [loading, setLoading] = useState(false);
  const { datasets = [], errors, sourceDataset, selectedSource = {}, sourceType } = localState;
  const { clusterID } = dashboard;
  const { errorText, progress } = useStyles();

  // Get list of sources datasets from hpcc
  useEffect(() => {
    if (Object.keys(selectedSource).length > 0) {
      setLoading(true);

      getSourceInfo(clusterID, selectedSource, sourceType).then(data => {
        const { datasets, fields, name } = data;

        if (sourceType === 'file') {
          handleChange(null, { name: 'selectedDataset', value: { name, fields } });
          handleChange(null, { name: 'dataset', value: name });
        } else {
          handleChange(null, { name: 'datasets', value: datasets });
        }

        setLoading(false);
      });
    }
  }, [clusterID, handleChange, handleChangeObj, selectedSource, sourceType]);

  useEffect(() => {
    if (datasets.length > 0 && sourceDataset) {
      let selectedDataset = datasets.find(({ name }) => name === sourceDataset);
      selectedDataset = selectedDataset ? selectedDataset : {};

      handleChange(null, { name: 'selectedDataset', value: selectedDataset });
    }
  }, [datasets, handleChange, handleChangeObj, sourceDataset]);

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
