import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, Toolbar, Typography } from '@material-ui/core';
import { Refresh as RefreshIcon } from '@material-ui/icons';

// Redux Actions
import { updateChart } from '../../features/chart/actions';

// React Components
import ChartEditor from '../ChartEditor';

// React Hooks
import useForm from '../../hooks/useForm';

// Utils
import { createChartObj, getPreviewData, mergeArrays, setEditorState } from '../../utils/chart';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { backgroundColor: theme.palette.info.main, color: theme.palette.info.contrastText },
  close: { padding: '10px 0', width: 16 },
  toolbar: { padding: 0 },
  typography: { flex: 1, marginLeft: 12 },
}));

const EditChartDialog = ({ chartID, show, toggleDialog }) => {
  const { dashboard } = useSelector(state => state.dashboard);
  const { charts } = useSelector(state => state.chart);
  const { eclObj, initState } = setEditorState(charts, chartID);

  // Set initial state
  const { values: localState, handleChange, handleChangeArr, handleChangeObj, handleCheckbox } = useForm(
    initState,
  );
  const eclRef = useRef(eclObj);
  const dispatch = useDispatch();
  const { button, toolbar, typography } = useStyles();

  // Reference values
  const {
    dataObj: { loading: previewLoading },
    error,
    selectedDataset = {},
    selectedSource = {},
    sourceType,
  } = localState;
  const sourceKeys = Object.keys(selectedSource).length;
  const datasetKeys = Object.keys(selectedDataset).length;

  // Update chart in DB and store
  const editChart = () => {
    const { chartID, sourceID, sourceType } = localState;
    const newECLObj = { ...eclRef.current };

    // Remove unneccesary key for DB
    delete newECLObj.data;

    const chartObj = createChartObj(localState, eclRef.current);

    // Update chart and global params in DB
    updateChart({ id: chartID, ...chartObj }, dashboard.id, sourceID, sourceType).then(action => {
      // Close dialog
      /*
        Closing the dialog happens here because React will attempt to update the component
        after the action updates the Redux store, causing a memory leak error because the component
        will already be un-mounted.
      */
      toggleDialog();

      return dispatch(action);
    });
  };

  const updateChartPreview = () => {
    const { config, mappedParams, selectedSource: source, sourceType } = localState;

    // Merge param arrays to send to server
    const usedParams = mergeArrays(config.params, mappedParams);

    if (sourceKeys > 0 && datasetKeys > 0) {
      // Set loading
      handleChange(null, { name: 'dataObj', value: { loading: true } });

      // Fetch data for selectedSource
      getPreviewData(dashboard.clusterID, { params: usedParams, source }, sourceType).then(data => {
        if (typeof data !== 'object') {
          return handleChange(null, { name: 'error', value: data });
        } else if (error !== '') {
          handleChange(null, { name: 'error', value: '' });
        }

        // Set data in local state object with source name as key
        handleChange(null, { name: 'dataObj', value: { data, loading: false } });
      });
    }
  };

  return (
    <Dialog open={show} fullWidth maxWidth='xl'>
      <Toolbar className={toolbar}>
        <Typography variant='h6' color='inherit' className={typography}>
          Edit Chart
        </Typography>
        {sourceType !== 'ecl' && (
          <Button
            disabled={sourceKeys === 0 || datasetKeys === 0 || previewLoading}
            onClick={updateChartPreview}
          >
            <RefreshIcon />
          </Button>
        )}
      </Toolbar>
      <DialogContent>
        <ChartEditor
          dashboard={dashboard}
          eclRef={eclRef}
          handleChange={handleChange}
          handleChangeArr={handleChangeArr}
          handleChangeObj={handleChangeObj}
          handleCheckbox={handleCheckbox}
          localState={localState}
        />
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='secondary' onClick={toggleDialog}>
          Cancel
        </Button>
        <Button variant='contained' className={button} onClick={editChart}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditChartDialog;
