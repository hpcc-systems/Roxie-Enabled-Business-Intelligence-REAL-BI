import React, { Fragment, useEffect, useCallback, useRef } from 'react';
import { CircularProgress, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import FileExplorer from './FileExplorer';

// Utils
import { getKeywordSearchResults } from '../../utils/hpcc';
import { useSnackbar } from 'notistack';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';

const SourceSearch = ({ dashboard, handleChange, localState, formFieldsUpdate }) => {
  const { enqueueSnackbar } = useSnackbar();

  const isMounted = useRef(); // Using this variable to unsubscibe from state update if component is unmounted

  const {
    chartID,
    errors,
    keyword,
    configuration: { isStatic = false },
    sources = [],
    keywordfromExplorer,
    sourceType,
    targetCluster,
    isIntegration,
    isAutoCompleteLoading,
  } = localState;
  const { id: clusterID } = dashboard.cluster;

  const selectedSource = isEmpty(localState.selectedSource) ? null : localState.selectedSource; // autocomplete fix

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
      formFieldsUpdate({ error: '', sources: data, isAutoCompleteLoading: false });
      if (chartID || isIntegration) {
        const selectedSource = data.find(({ name }) => name === keyword);
        if (isIntegration) {
          handleAutocompleteSelect(null, selectedSource);
        } else {
          formFieldsUpdate({ selectedSource });
        }
      }
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
        if (!keywordfromExplorer) {
          updateAutocompleteDebounced(clusterID, keyword);
        }
        formFieldsUpdate({ keywordfromExplorer: false });
      }
    }
    return () => (isMounted.current = false);
  }, [chartID, clusterID, keyword]);

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

  return !isStatic ? (
    <>
      <Box>
        <Autocomplete
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
      </Box>
      {sourceType === 'file' ? (
        <Box component={Paper} elevation={2} p={2} my={2} maxHeight='200px' overflow='auto'>
          <FileExplorer
            formFieldsUpdate={formFieldsUpdate}
            clusterId={clusterID}
            selectedSource={selectedSource}
          />
        </Box>
      ) : null}
    </>
  ) : null;
};

export default SourceSearch;
