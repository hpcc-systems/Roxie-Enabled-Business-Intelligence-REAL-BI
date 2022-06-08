import React, { Fragment, useEffect, useRef, useCallback } from 'react';
import { CircularProgress, Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

// Utils
import { getKeywordSearchResults } from '../../../utils/hpcc';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import { useSnackbar } from 'notistack';

const SourceSearch = ({ dashboard, filter, handleChange, formFieldsUpdate, localState }) => {
  const {
    chartID,
    errors,
    keyword,
    sources = [],
    sourceType,
    targetCluster,
    isAutoCompleteLoading,
  } = localState;
  const { id: clusterID } = dashboard.cluster;
  const { enqueueSnackbar } = useSnackbar();

  const isMounted = useRef(); // Using this variable to unsubscribe from state update if component is unmounted

  const selectedSource = isEmpty(localState.selectedSource) ? null : localState.selectedSource; // autocomplete fix

  // Get list of sources from hpcc

  const updateAutocomplete = async (clusterID, keyword) => {
    if (!isMounted.current) return;
    if (sourceType === 'query' && !targetCluster) {
      return enqueueSnackbar('Target Cluster is not selected, please select Target Cluster', {
        variant: 'warning',
        autoHideDuration: 2000,
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
          preventDuplicate: true,
        },
      });
    }
    formFieldsUpdate({ isAutoCompleteLoading: true });
    try {
      const data = await getKeywordSearchResults(
        clusterID,
        keyword,
        sourceType,
        targetCluster,
        dashboard.accessOnBehalf,
      );
      if (!isMounted.current) return;
      const updateFields = { error: '', sources: data, isAutoCompleteLoading: false };

      if (filter) {
        const selectedSource = data.find(({ name }) => name === keyword);
        if (selectedSource) updateFields.selectedSource = selectedSource;
      }
      formFieldsUpdate(updateFields);
    } catch (error) {
      if (!isMounted.current) return;
      formFieldsUpdate({ error: error.message, isAutoCompleteLoading: false });
    }
  };

  const updateAutocompleteDebounced = useCallback(debounce(updateAutocomplete, 1000), [
    sourceType,
    targetCluster,
  ]);

  useEffect(() => {
    isMounted.current = true;
    if (keyword && !selectedSource) {
      if (isMounted.current) {
        updateAutocompleteDebounced(clusterID, keyword);
      }
    }
    return () => (isMounted.current = false);
  }, [chartID, clusterID, keyword]);

  // Determine when to update 'keyword' field in state
  const updateKeyword = (event, newInputValue) => {
    handleChange(null, { name: 'keyword', value: newInputValue });
  };

  const handleAutocompleteSelect = (_event, newValue) => {
    // Confirm variable has a value
    newValue = newValue ? newValue : {};
    handleChange(null, { name: 'selectedSource', value: newValue });
    newValue.name &&
      enqueueSnackbar(`${newValue.name} file selected`, {
        variant: 'success',
        autoHideDuration: 3000,
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
          preventDuplicate: true,
        },
      });
  };

  const selectedSourceErr = errors.find(err => err['selectedSource']);

  return (
    <Grid item xs={12}>
      <Autocomplete
        disabled={!localState.isFilterReady}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={({ cluster, name }) => {
          let label = '';
          if (name) {
            label += name;
            if (cluster) {
              label += ` (${cluster})`;
            }
          }
          return label;
        }}
        options={sources}
        loading={isAutoCompleteLoading}
        loadingText='...fetching latest data'
        value={selectedSource} // this is autocomplete value
        onChange={handleAutocompleteSelect} // triggeres when autocomplete selected
        inputValue={keyword} // textfield value
        onInputChange={updateKeyword} // update textfield
        renderInput={params => (
          <TextField
            {...params}
            name='keyword'
            label={sourceType === 'file' ? 'File Name' : 'Query Name'}
            fullWidth
            error={selectedSourceErr !== undefined}
            helperText={selectedSourceErr !== undefined ? selectedSourceErr['selectedSource'] : ''}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {isAutoCompleteLoading ? <CircularProgress color='inherit' size={20} /> : null}
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
