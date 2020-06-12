import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

// Utils
import { getSourceInfo, getSources } from '../../utils/source';

// Create styles
const useStyles = makeStyles(theme => ({
  autocomplete: { margin: 0, marginTop: theme.spacing(1) },
}));

const SourceSearch = ({ dashboard, handleChange, localState }) => {
  const [loading, setLoading] = useState(false);
  const { filterID, keyword, sources, sourceType } = localState;
  const { clusterID } = dashboard;
  const { autocomplete } = useStyles();

  // Get list of queries from hpcc
  useEffect(() => {
    if (keyword) {
      setLoading(true);

      getSources(clusterID, keyword, sourceType).then(data => {
        handleChange(null, { name: 'sources', value: data });

        if (filterID) {
          const selectedSource = data.find(({ name }) => name === keyword);
          handleChange(null, { name: 'selectedSource', value: selectedSource });

          if (sourceType === 'file') {
            getSourceInfo(clusterID, selectedSource, sourceType).then(data => {
              handleChange(null, { name: 'selectedDataset', value: data });
              handleChange(null, { name: 'dataset', value: data.name });
            });
          }
        }

        setLoading(false);
      });
    }
  }, [clusterID, filterID, handleChange, keyword, sourceType]);

  // Determine when to update 'keyword' field in state
  const updateKeyword = event => {
    event.persist();
    const { value } = event.target;

    // Check if the user has typed in at least 3 characters and a request is not already in progress
    if (value.length >= 3 && !loading) {
      // Update 'keyword' field in state
      handleChange(event);
    }
  };

  const handleOnChange = (event, newValue) => {
    // Confirm variable has a value
    newValue = newValue ? newValue : {};

    handleChange(null, { name: 'selectedSource', value: newValue });

    if (sourceType === 'file') {
      if (Object.keys(newValue).length > 0) {
        getSourceInfo(clusterID, newValue, sourceType).then(data => {
          handleChange(null, { name: 'selectedDataset', value: data });
          handleChange(null, { name: 'dataset', value: data.name });
        });
      } else {
        handleChange(null, { name: 'selectedDataset', value: {} });
        handleChange(null, { name: 'dataset', value: '' });
      }
    }
  };

  return (
    !filterID && (
      <Autocomplete
        className={autocomplete}
        onChange={handleOnChange}
        getOptionLabel={option => (option.name ? option.name : '')}
        options={sources}
        renderInput={params => (
          <TextField
            {...params}
            name='keyword'
            value={keyword}
            onChange={updateKeyword}
            label={sourceType === 'file' ? 'File Name' : 'Query Name'}
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {loading ? <CircularProgress color='inherit' size={20} /> : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            }}
          />
        )}
      />
    )
  );
};

export default SourceSearch;
