import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

// Redux Actions
import { getQueries } from '../../../features/query/actions';

// Create styles
const useStyles = makeStyles(() => ({
  autocomplete: { marginBottom: 24 },
}));

const QuerySearch = ({ handleChange, keyword }) => {
  const [timeout, setTimeOutState] = useState(null);
  const [loading, setLoading] = useState(false);
  const { clusterID } = useSelector(state => state.dashboard.dashboard);
  const { queries } = useSelector(state => state.query);
  const dispatch = useDispatch();
  const { autocomplete } = useStyles();

  // ComponentDidMount
  // Get list of queries from hpcc based on keyword(s) provided, if an API request isn't in progress
  useEffect(() => {
    if (keyword !== '') {
      setLoading(true);

      getQueries(clusterID, keyword).then(action => {
        dispatch(action);
        setLoading(false);

        // Clear timeout to avoid side effects
        clearTimeout(timeout);
        setTimeOutState(null);
      });
    }
  }, [clusterID, dispatch, keyword, timeout]);

  // Determine when to update 'keyword' field in state
  const updateKeyword = event => {
    // persists the event object for the original event that triggered this function
    event.persist();

    // If a setTimeout id exists, clear it
    if (timeout) {
      clearTimeout(timeout);
      setTimeOutState(null);
    }

    // Create new setTimeout event
    const newTimeout = setTimeout(() => {
      // Update 'keyword' field in state
      handleChange(event);
    }, 1000);

    // Update setTimeout id in local state
    setTimeOutState(newTimeout);
  };

  return (
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
          label="Search Query"
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
  );
};

export default QuerySearch;
