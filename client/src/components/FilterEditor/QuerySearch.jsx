import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

// Utils
import { getQueries } from '../../utils/query';

// Create styles
const useStyles = makeStyles(theme => ({
  autocomplete: { margin: 0, marginTop: theme.spacing(1) },
}));

const QuerySearch = ({ dashboard, handleChange, localState }) => {
  const [loading, setLoading] = useState(false);
  const { keyword, queries } = localState;
  const { clusterID } = dashboard;
  const { autocomplete } = useStyles();

  // Get list of queries from hpcc
  useEffect(() => {
    if (keyword) {
      setLoading(true);

      getQueries(clusterID, keyword).then(data => {
        handleChange(null, { name: 'queries', value: data });

        setLoading(false);
      });
    }
  }, [clusterID, handleChange, keyword]);

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

  return (
    <Autocomplete
      className={autocomplete}
      onChange={(event, newValue) => {
        // Only attempt to update state if a value is present
        if (newValue) {
          handleChange(null, { name: 'query', value: newValue });
        }
      }}
      getOptionLabel={option => (option.name ? option.name : '')}
      options={queries}
      renderInput={params => (
        <TextField
          {...params}
          name='keyword'
          value={keyword}
          onChange={updateKeyword}
          label='Query'
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
  );
};

export default QuerySearch;
