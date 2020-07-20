import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import classnames from 'classnames';

// Utils
import { getSources } from '../../utils/source';

// Create styles
const useStyles = makeStyles(theme => ({
  autocomplete: { margin: 0, marginTop: theme.spacing(1) },
  autocomplete2: { marginBottom: theme.spacing(3) },
}));

const SourceSearch = ({ dashboard, handleChange, localState }) => {
  const [loading, setLoading] = useState(false);
  const {
    chartID,
    chartType,
    error,
    keyword,
    options: { isStatic = false },
    sources,
    selectedSource = {},
    sourceType,
  } = localState;
  const { clusterID } = dashboard;
  const { autocomplete, autocomplete2 } = useStyles();

  // Get list of sources from hpcc
  useEffect(() => {
    if (keyword) {
      setLoading(true);

      getSources(clusterID, keyword, sourceType).then(data => {
        // Error received from server
        if (!Array.isArray(data)) {
          setLoading(false);
          return handleChange(null, { name: 'error', value: data });
        } else if (error !== '') {
          handleChange(null, { name: 'error', value: '' });
        }

        handleChange(null, { name: 'sources', value: data });

        if (chartID) {
          const selectedSource = data.find(({ name }) => name === keyword);
          handleChange(null, { name: 'selectedSource', value: selectedSource });
        }

        setLoading(false);
      });
    }
  }, [chartID, clusterID, error, handleChange, keyword, sourceType]);

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

  return chartID && (chartType !== 'textBox' || (chartType === 'textBox' && !isStatic)) ? (
    // If chartID is present then component is being edited and this text box is just displaying the datasource name
    <TextField
      className={classnames(autocomplete, { [autocomplete2]: sourceType === 'file' })}
      disabled={true}
      value={selectedSource.name || ' '}
      label='Source'
      fullWidth
    />
  ) : chartType !== 'textBox' || (chartType === 'textBox' && !isStatic) ? (
    <Autocomplete
      className={classnames(autocomplete, { [autocomplete2]: sourceType === 'file' })}
      onChange={handleOnChange}
      getOptionLabel={({ cluster, name }) => (name ? `${name} (${cluster})` : '')}
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
  ) : null;
};

export default SourceSearch;
