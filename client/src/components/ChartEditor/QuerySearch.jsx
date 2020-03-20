import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

// Utils
import { getQueries } from '../../utils/query';

// Create styles
const useStyles = makeStyles(theme => ({
  autocomplete: { margin: `${theme.spacing(1)}px 0`, marginTop: 0 },
}));

const QuerySearch = ({ dashboard, handleChange, localState }) => {
  const [loading, setLoading] = useState(false);
  const { chartID, keyword, queries } = localState;
  const { clusterID } = dashboard;
  const { autocomplete } = useStyles();

  // Get list of queries from hpcc
  useEffect(() => {
    if (keyword) {
      setLoading(true);

      getQueries(clusterID, keyword).then(data => {
        handleChange(null, { name: 'queries', value: data });

        if (chartID) {
          const selectedQuery = data.filter(({ name }) => name === keyword)[0];
          handleChange(null, { name: 'selectedQuery', value: selectedQuery });
        }
        setLoading(false);
      });
    }
  }, [chartID, clusterID, handleChange, keyword]);

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

  // Do not show if in edit mode (chart ID populated)
  // Continue to mount component to get useEffect to run
  return (
    !chartID && (
      <Autocomplete
        className={autocomplete}
        onChange={(event, newValue) => {
          // Only attempt to update state if a value is present
          if (newValue) {
            handleChange(null, { name: 'selectedQuery', value: newValue });
          }
        }}
        getOptionLabel={option => (option.name ? option.name : '')}
        options={queries}
        renderInput={params => (
          <TextField
            {...params}
            name="keyword"
            value={keyword}
            onChange={updateKeyword}
            label="Query"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
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

export default QuerySearch;
