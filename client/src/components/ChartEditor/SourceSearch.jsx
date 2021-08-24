import React, { Fragment, useEffect, useCallback, useRef } from 'react';
import { CircularProgress, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import FileExplorer from './FileExplorer';

// Utils
import { getKeywordSearchResults } from '../../utils/hpcc';
import { useSnackbar } from 'notistack';
import _ from 'lodash';

const SourceSearch = ({ dashboard, handleChange, localState, formFieldsUpdate }) => {
  const { enqueueSnackbar } = useSnackbar();

  const isMounted = useRef(); // Using this variable to unsubscibe from state update if component is unmounted

  const {
    chartID,
    errors,
    keyword,
    configuration: { isStatic = false, type },
    sources = [],
    keywordfromExplorer,
    sourceType,
    isIntegration,
    isAutoCompleteLoading,
  } = localState;
  const { id: clusterID } = dashboard.cluster;

  const selectedSource = _.isEmpty(localState.selectedSource) ? null : localState.selectedSource; // autocomplete fix

  const updateAutocomplete = async (clusterID, keyword) => {
    if (!isMounted.current) return;
    formFieldsUpdate({ isAutoCompleteLoading: true });
    try {
      const data = await getKeywordSearchResults(clusterID, keyword, sourceType);
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

  const updateAutocompleteDebounced = useCallback(_.debounce(updateAutocomplete, 1000), [sourceType]);

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
          vertical: 'bottom',
          horizontal: 'left',
          preventDuplicate: true,
        },
      });
  };

  const selectedSourceErr = errors.find(err => err['selectedSource']);

  return type !== 'textBox' || (type === 'textBox' && !isStatic) ? (
    <>
      <Box mb={2}>
        <Autocomplete
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={({ cluster, name }) => (name ? `${name} (${cluster})` : '')}
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
