import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Refresh as RefreshIcon } from '@material-ui/icons';

// Redux Actions
import { updateChart } from '../../features/chart/actions';

// React Components
import ChartEditor from '../ChartEditor';

// React Hooks
import useForm from '../../hooks/useForm';

// Utils
import { createChartObj, getPreviewData, setEditorState } from '../../utils/chart';

// Create styles
const useStyles = makeStyles(() => ({
  close: { padding: '10px 0', width: 16 },
  toolbar: { padding: 0 },
  typography: { flex: 1, marginLeft: 12 },
}));

const EditChartDialog = ({ chartID, show, toggleDialog }) => {
  // Get selected chart
  const { charts } = useSelector(state => state.chart);
  const initState = setEditorState(charts, chartID);

  // Set initial state
  const { values: localState, handleChange, handleChangeArr, handleChangeObj } = useForm(initState);
  const { dashboard } = useSelector(state => state.dashboard);
  const dispatch = useDispatch();
  const { toolbar, typography } = useStyles();

  // Reference values
  const {
    dataObj: { loading: previewLoading },
    selectedDataset,
    selectedQuery,
  } = localState;
  const queryKeys = Object.keys(selectedQuery).length;
  const datasetKeys = Object.keys(selectedDataset).length;

  // Update chart in DB and store
  const editChart = () => {
    const { chartID, queryID, sort } = localState;
    const chartObj = createChartObj(localState, sort);

    // Update chart and global params in DB
    updateChart({ id: chartID, ...chartObj }, dashboard.id, queryID).then(action => {
      dispatch(action);

      // Close dialog
      return toggleDialog();
    });
  };

  const updateChartPreview = () => {
    const { params, selectedQuery } = localState;

    if (queryKeys > 0 && datasetKeys > 0) {
      // Set loading
      handleChange(null, { name: 'dataObj', value: { loading: true } });

      // Fetch data for selectedQuery
      getPreviewData(dashboard.clusterID, { params, query: selectedQuery }).then(data => {
        // Set data in local state object with query name as key
        handleChange(null, { name: 'dataObj', value: { data, loading: false } });
      });
    }
  };

  return (
    <Dialog open={show} fullWidth maxWidth="xl">
      <Toolbar className={toolbar}>
        <Typography variant="h6" color="inherit" className={typography}>
          Edit Chart
        </Typography>
        <Button
          disabled={!queryKeys > 0 || !datasetKeys > 0 || previewLoading}
          onClick={updateChartPreview}
        >
          <RefreshIcon />
        </Button>
      </Toolbar>
      <DialogContent>
        <ChartEditor
          dashboard={dashboard}
          handleChange={handleChange}
          handleChangeArr={handleChangeArr}
          handleChangeObj={handleChangeObj}
          localState={localState}
        />
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={toggleDialog}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={editChart}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditChartDialog;
