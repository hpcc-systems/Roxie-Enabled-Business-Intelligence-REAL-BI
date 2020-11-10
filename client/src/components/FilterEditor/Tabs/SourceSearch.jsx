import React, { Fragment, useEffect, useState } from 'react';
import { CircularProgress, Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

// Utils
import { getKeywordSearchResults } from '../../../utils/hpcc';

const SourceSearch = ({ dashboard, filter, handleChange, localState }) => {
  const [loading, setLoading] = useState(false);
  const { chartID, error, errors, keyword, selectedSource = {}, sources, sourceType } = localState;
  const { id: clusterID } = dashboard.cluster;

  // Get list of sources from hpcc
  useEffect(() => {
    if (keyword) {
      (async () => {
        setLoading(true);

        try {
          const data = await getKeywordSearchResults(clusterID, keyword, sourceType);

          handleChange(null, { name: 'error', value: '' });
          handleChange(null, { name: 'sources', value: data });

          if (filter) {
            const selectedSource = data.find(({ name }) => name === keyword);
            handleChange(null, { name: 'selectedSource', value: selectedSource });
          }
        } catch (error) {
          handleChange(null, { name: 'error', value: error.message });
        }

        setLoading(false);
      })();
    }
  }, [chartID, clusterID, error, filter, handleChange, keyword, sourceType]);

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
  };

  const selectedSourceErr = errors.find(err => err['selectedSource']);

  return (
    <Grid item xs={12}>
      <Autocomplete
        onChange={handleOnChange}
        getOptionLabel={({ cluster, name }) => (name ? `${name} (${cluster})` : '')}
        options={sources}
        value={selectedSource}
        fullWidth
        renderInput={params => (
          <TextField
            {...params}
            name='keyword'
            value={keyword}
            onChange={updateKeyword}
            label={sourceType === 'file' ? 'File Name' : 'Query Name'}
            fullWidth
            error={selectedSourceErr !== undefined}
            helperText={selectedSourceErr !== undefined ? selectedSourceErr['selectedSource'] : ''}
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
    </Grid>
  );
};

export default SourceSearch;
