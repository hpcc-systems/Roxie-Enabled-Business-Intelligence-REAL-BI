import React, { Fragment, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, Toolbar, Typography } from '@material-ui/core';
import { Refresh as RefreshIcon, TableChart as TableChartIcon } from '@material-ui/icons';
import classnames from 'classnames';

// Redux Actions
import { updateChart } from '../../features/dashboard/actions';

// React Components
import ChartEditor from '../ChartEditor';
import DataSnippetDialog from './DataSnippet';

// React Hooks
import useForm from '../../hooks/useForm';
import useDialog from '../../hooks/useDialog';

// Utils
import { createChartObj, setEditorState } from '../../utils/chart';
import { createSource, createSourceObj } from '../../utils/source';
import { getChartPreviewData } from '../../utils/hpcc';
import { validateSource } from '../../utils/validate';

// Create styles
const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
  },
  button2: { minWidth: 20 },
  button3: { marginRight: theme.spacing(1) },
  button4: { marginRight: theme.spacing(2) },
  close: { padding: '10px 0', width: 16 },
  paper: {
    maxHeight: '70vh',
    minHeight: '63vh',
  },
  toolbar: { padding: 0 },
  typography: { flex: 1, marginLeft: 12 },
}));

const EditChartDialog = ({ chartID, show, toggleDialog }) => {
  const { dashboard } = useSelector(state => state.dashboard);
  const { charts = [] } = dashboard;
  const { eclObj, initState } = setEditorState(charts, chartID);
  const { showDialog, toggleDialog: toggleData } = useDialog(false);

  // Set initial state
  const { values: localState, handleChange, handleChangeArr, handleChangeObj, handleCheckbox } = useForm(
    initState,
  );
  const eclRef = useRef(eclObj);
  const dispatch = useDispatch();
  const { button, button2, button3, button4, paper, toolbar, typography } = useStyles();

  // Reference values
  const {
    dataObj: { data = [], loading },
    selectedDataset = {},
    selectedSource = {},
    sourceType,
  } = localState;
  const sourceKeys = Object.keys(selectedSource).length;
  const datasetKeys = Object.keys(selectedDataset).length;

  // Update chart in DB and store
  const editChart = async () => {
    const { chartID, configuration, dataset } = localState;
    const { isStatic, type } = configuration;
    const { id: dashboardID } = dashboard;

    if (type === 'textBox' && isStatic) {
      const chartObj = { id: chartID, configuration: { ...configuration, dataset, ecl: {} } };

      try {
        const action = await updateChart(chartObj, dashboardID);
        dispatch(action);
        return toggleDialog();
      } catch (error) {
        return dispatch(error);
      }
    } else {
      try {
        validateSource(localState, eclRef);
      } catch (errors) {
        return handleChange(null, { name: 'errors', value: errors });
      }

      const sourceObj = createSourceObj(localState, eclRef.current);
      const chartObj = createChartObj(localState, eclRef.current);
      let newSource;

      try {
        newSource = await createSource(sourceObj);
      } catch (error) {
        return handleChange(null, { name: 'error', value: error.message });
      }

      try {
        const updatedChartObj = { id: chartID, configuration: chartObj, source: newSource };
        const action = await updateChart(updatedChartObj, dashboardID);
        dispatch(action);
        return toggleDialog();
      } catch (error) {
        return dispatch(error);
      }
    }
  };

  const updateChartPreview = () => {
    const { dataset, params, selectedSource: source, sourceType } = localState;

    if (sourceKeys > 0 && datasetKeys > 0) {
      (async () => {
        handleChange(null, { name: 'dataObj', value: { loading: true } });

        try {
          const options = { dataset, params, source };
          const data = await getChartPreviewData(dashboard.cluster.id, options, sourceType);

          handleChange(null, { name: 'error', value: '' });
          handleChange(null, { name: 'dataObj', value: { data, loading: false } });
        } catch (error) {
          handleChange(null, { name: 'error', value: error.message });
          handleChange(null, { name: 'dataObj', value: { loading: false } });
        }
      })();
    }
  };

  return (
    <Fragment>
      <Dialog open={show} fullWidth maxWidth='xl' classes={{ paper }}>
        <Toolbar className={toolbar}>
          <Typography variant='h6' color='inherit' className={typography}>
            Edit Chart
          </Typography>
          <Button
            className={classnames(button2, button3)}
            disabled={sourceKeys === 0 || datasetKeys === 0 || loading || data.length === 0}
            onClick={() => toggleData(chartID)}
          >
            <TableChartIcon />
          </Button>
          {sourceType !== 'ecl' && (
            <Button
              className={classnames(button2, button4)}
              disabled={sourceKeys === 0 || datasetKeys === 0 || loading}
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
      {showDialog && (
        <DataSnippetDialog
          data={localState?.dataObj?.data?.data || []}
          show={showDialog}
          toggleDialog={toggleData}
        />
      )}
    </Fragment>
  );
};

export default EditChartDialog;
