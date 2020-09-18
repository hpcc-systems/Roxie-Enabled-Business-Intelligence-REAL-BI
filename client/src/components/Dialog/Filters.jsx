import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@material-ui/core';

// Redux Actions
import { updateDashboard } from '../../features/dashboard/actions';

// React Components
import FilterEditor from '../FilterEditor';

// React Hooks
import useForm from '../../hooks/useForm';

// Utils
import { createSourceObj, addSource } from '../../utils/source';
import { createFilterObj } from '../../utils/dashboard';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { backgroundColor: theme.palette.info.main, color: theme.palette.info.contrastText },
  dialog: { minWidth: '50vw', maxWidth: '50vw' },
  formControl: { margin: 0, marginTop: theme.spacing(1), marginBottom: theme.spacing(1) },
  progress: { marginRight: 15 },
  typography: { margin: theme.spacing(1, 0, 0, 3) },
}));

const initState = {
  error: '',
  keyword: '',
  name: '',
  selectedDataset: '',
  selectedSource: {},
  sourceDataset: '',
  sourceField: '',
  sourceID: '',
  sources: [],
  sourceType: 'query',
  params: [{ targetChart: '', targetParam: '' }],
};

const NewFilter = ({ dashboard, filterIndex, show, toggleDialog }) => {
  const { values: localState, handleChange, handleChangeObj, resetState } = useForm(initState);
  const [loading, setLoading] = useState(false);
  const { charts } = useSelector(state => state.chart);
  const { filters = [], id: dashboardID } = dashboard;
  const eclRef = useRef({});
  const dispatch = useDispatch();
  const { button, dialog, progress, typography } = useStyles();

  useEffect(() => {
    if (filterIndex >= 0) {
      const filter = filters[filterIndex];
      const { ecl, params, sourceDataset, sourceName, sourceType } = filter;

      const newParams = [...params, { targetChart: '', targetParam: '' }];

      const newState = {
        ...filter,
        error: '',
        keyword: sourceName,
        params: newParams,
        selectedDataset: sourceDataset,
        selectedSource: {},
        sources: [],
        sourceType,
      };

      resetState(newState);
      eclRef.current = ecl;
    }
  }, [filterIndex, filters, resetState]);

  const saveFilter = async () => {
    const sourceObj = createSourceObj(localState, eclRef.current);
    const newFilterObj = createFilterObj(localState, eclRef.current);

    setLoading(true);

    try {
      const { sourceID } = await addSource(dashboardID, sourceObj);

      // Append source ID to new filter object
      newFilterObj.sourceID = sourceID;

      // Create new dashboard object
      const dashboardObj = { ...dashboard };

      // Update dashboard object
      if (filterIndex >= 0) {
        dashboardObj.filters[filterIndex] = newFilterObj;
      } else {
        dashboardObj.filters.push(newFilterObj);
      }

      // Update DB and Redux store
      updateDashboard(dashboardObj).then(action => {
        dispatch(action);

        // Close dialog
        return toggleDialog();
      });
    } catch (err) {
      console.error(err);
      return setLoading(false);
    }
  };

  return (
    <Dialog open={show} fullWidth classes={{ paper: dialog }}>
      <Typography variant='h6' color='inherit' className={typography}>
        Dashboard Filter
      </Typography>
      <DialogContent>
        <FilterEditor
          charts={charts}
          dashboard={dashboard}
          eclRef={eclRef}
          filterIndex={filterIndex}
          handleChange={handleChange}
          handleChangeObj={handleChangeObj}
          localState={localState}
        />
      </DialogContent>
      <DialogActions>
        <Button color='secondary' onClick={toggleDialog}>
          Cancel
        </Button>
        <Button variant='contained' className={button} disabled={loading} onClick={saveFilter}>
          {loading && <CircularProgress color='inherit' size={20} className={progress} />}
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewFilter;
