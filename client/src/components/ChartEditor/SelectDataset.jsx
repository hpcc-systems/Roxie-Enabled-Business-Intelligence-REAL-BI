import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

// Redux Actions
import { getQueryInfo } from '../../features/query/actions';

// Create styles
const useStyles = makeStyles(theme => ({
  formControl: { margin: `${theme.spacing(1)}px 0` },
  progress: { margin: `${theme.spacing(1)}px 0` },
}));

const SelectDataset = ({ dispatch, handleChange, localState }) => {
  const [loading, setLoading] = useState(false);
  const { clusterID } = useSelector(state => state.dashboard.dashboard);
  const { datasets = [], params } = useSelector(state => state.query.query);
  const { dataset, id: chartID, query } = localState;
  const { formControl, progress } = useStyles();

  // ComponentDidMount -> Get list of query datasets from hpcc
  useEffect(() => {
    if (query) {
      setLoading(true);

      getQueryInfo(clusterID, query).then(action => {
        dispatch(action);

        setLoading(false);
      });
    }
  }, [clusterID, dispatch, query]);

  useEffect(() => {
    if (dataset) {
      const selectedDataset = datasets.filter(({ name }) => name === dataset)[0];
      const datasetObj = { params, ...selectedDataset };

      // Set datasetObj
      handleChange({ target: { name: 'datasetObj', value: datasetObj } });
    }
  }, [dataset, datasets, handleChange, params]);

  // Do not show if in edit mode (chart ID populated)
  // Continue to mount component to get useEffect to run
  return !chartID ? (
    loading ? (
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
    )
  ) : null;
};

export default SelectDataset;
