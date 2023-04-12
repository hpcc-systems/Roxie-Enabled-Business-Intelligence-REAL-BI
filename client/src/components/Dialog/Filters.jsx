import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@material-ui/core';

// Redux Actions
import { createFilter, refreshDataByChartIds, updateExistingFilter } from '../../features/dashboard/actions';

// React Components
import FilterEditor from '../FilterEditor';

// React Hooks
import useForm from '../../hooks/useForm';

// Utils
import { createSource, createSourceObj } from '../../utils/source';
import { createFilterObj } from '../../utils/dashboardFilter';
import { validateFilter } from '../../utils/validate';
import LoadingSpinner from '../Common/LoadingSpinner';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { backgroundColor: theme.palette.info.main, color: theme.palette.info.contrastText },
  dialog: { minWidth: '55vw', maxWidth: '55vw' },
  formControl: { margin: 0, marginTop: theme.spacing(1), marginBottom: theme.spacing(1) },
  progress: { marginRight: 15 },
  typography: { margin: theme.spacing(1, 0, 0, 2.75) },
}));

const initState = {
  error: '',
  errors: [],
  filterType: 'valuesDropdown',
  keyword: '',
  name: '',
  selectedDataset: {},
  selectedSource: {},
  sourceDataset: '',
  sourceField: '',
  sourceID: '',
  sources: [],
  sourceType: 'query',
  targetCluster: '',
  params: [{ targetChart: '', targetParam: '' }],
  isAutoCompleteLoading: false,
  isFilterReady: false,
};

const Filters = ({ dashboard, filter, show, toggleDialog }) => {
  const { values: localState, formFieldsUpdate, handleChange, handleChangeObj, resetState } = useForm(
    initState,
  );
  const [loading, setLoading] = useState(false);
  const { charts = [], cluster, id: dashboardID } = dashboard;
  const eclRef = useRef({});
  const dispatch = useDispatch();
  const { button, dialog, progress, typography } = useStyles();

  useEffect(() => {
    if (filter) {
      const {
        configuration: {
          dataset,
          ecl = {},
          field,
          filterParams,
          type: filterType,
          name: filterName,
          params = [],
        },

        id: filterID,
        source = {},
      } = filter;

      const newState = {
        datasets: [],
        error: '',
        filterID,
        filterParams,
        filterType,
        keyword: source?.name || '',
        name: filterName,
        params: [...params, { datePart: '', targetChart: '', targetParam: '' }],
        sourceDataset: dataset,
        selectedSource: {},
        sources: [],
        sourceField: field,
        sourceID: source?.id || '',
        sourceType: source?.type || '',
        isAutoCompleteLoading: false,
      };

      resetState(newState);
      eclRef.current = ecl;
    } else {
      formFieldsUpdate({ isFilterReady: true });
    }
  }, [filter, resetState]);

  useEffect(() => {
    handleChange(null, { name: 'errors', value: [] });
  }, [handleChange, localState.sourceType]);

  const saveFilter = async () => {
    const { filterType } = localState;
    let sourceID;

    try {
      validateFilter(localState, eclRef);
    } catch (errors) {
      return handleChange(null, { name: 'errors', value: errors });
    }

    setLoading(true);

    if (filterType !== 'dateRange' && filterType !== 'dateField') {
      const sourceObj = createSourceObj(localState, eclRef.current);

      try {
        const newSource = await createSource(sourceObj);
        sourceID = newSource.id;
      } catch (error) {
        setLoading(false);
        return handleChange(null, { name: 'error', value: error.message });
      }
    }

    const newFilterObj = createFilterObj(localState, eclRef.current);

    try {
      let action;

      if (filter) {
        action = await updateExistingFilter(dashboardID, { id: filter.id, ...newFilterObj }, sourceID);
      } else {
        action = await createFilter(newFilterObj, cluster.id, dashboardID, sourceID);
      }

      dispatch(action);

      // Get unique id's of the targeted charts
      const effectedChartIds = [...new Set(newFilterObj.params.map(({ targetChart }) => targetChart))];
      dispatch(refreshDataByChartIds(effectedChartIds));

      return toggleDialog();
    } catch (error) {
      dispatch(error);
      return setLoading(false);
    }
  };

  return (
    <Dialog open={show} fullWidth classes={{ paper: dialog }}>
      <Typography variant='h6' color='inherit' className={typography}>
        {!localState.isFilterReady ? (
          <LoadingSpinner text='...loading filter data' size={10} />
        ) : (
          ' Dashboard Filter'
        )}
      </Typography>
      <DialogContent>
        <FilterEditor
          charts={charts}
          dashboard={dashboard}
          eclRef={eclRef}
          filter={filter}
          handleChange={handleChange}
          handleChangeObj={handleChangeObj}
          formFieldsUpdate={formFieldsUpdate}
          localState={localState}
        />
      </DialogContent>
      <DialogActions>
        <Button color='secondary' onClick={toggleDialog}>
          Cancel
        </Button>
        <Button
          variant='contained'
          className={button}
          onClick={saveFilter}
          disabled={loading || !localState.isFilterReady}
        >
          {loading && <CircularProgress color='inherit' size={20} className={progress} />}
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Filters;
