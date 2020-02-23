import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

// Redux Actions
import { getQueries } from '../../features/query/actions';

// Create styles
const useStyles = makeStyles(theme => ({
  autocomplete: { margin: `${theme.spacing(1)}px 0` },
}));

const QuerySearch = ({ dispatch, handleChange, localState }) => {
  const [loading, setLoading] = useState(false);
  const { clusterID } = useSelector(state => state.dashboard.dashboard);
  const { queries } = useSelector(state => state.query);
  const { id: chartID, keyword } = localState;
  const { autocomplete } = useStyles();

  // ComponentDidMount
  // Get list of queries from hpcc
  useEffect(() => {
    if (keyword) {
      setLoading(true);

      getQueries(clusterID, keyword).then(action => {
        dispatch(action);
        setLoading(false);
      });
    }
  }, [clusterID, dispatch, keyword]);

  // Determine when to update 'keyword' field in state
  const updateKeyword = event => {
    const { value } = event.target;

    // Check if the user has typed in at least 3 characters and a request is not already in progress
    if (value.length >= 3 && !loading) {
      // Update 'keyword' field in state
      handleChange(event);
    }
  };

  // Do not show if in edit mode (chart ID populated)
  // Continue to mount component to get useEffect to run
  return !chartID ? (
    <Autocomplete
      className={autocomplete}
      onChange={(event, newValue) => {
        // Only attempt to update state if a value is present
        // This on change will fire if the user clears the autocomplete component
        if (newValue) {
          handleChange({ target: { name: 'query', value: newValue.querySet } });
        }
      }}
      getOptionLabel={option => (option.name ? option.name : '')}
      options={queries}
      renderInput={params => (
        <TextField
          {...params}
          name="keyword"
          value={keyword}
          onChange={event => updateKeyword(event)}
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
  ) : null;
};

export default QuerySearch;
