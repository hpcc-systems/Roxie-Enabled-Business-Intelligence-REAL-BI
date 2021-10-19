import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, Toolbar, Typography } from '@material-ui/core';
import { Refresh as RefreshIcon, TableChart as TableChartIcon } from '@material-ui/icons';
import clsx from 'clsx';

// Redux Actions
// import { refreshDataByChartIds } from '../../features/dashboard/actions';
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
import { createErrorMessage } from '../../utils/misc';
import useNotifier from '../../hooks/useNotifier';

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
  scrollPaper: {
    maxHeight: '100%',
  },
  toolbar: { padding: 0 },
  typography: { flex: 1, marginLeft: 12 },
}));

const EditChartDialog = ({ show, toggleDialog }) => {
  const { dashboard } = useSelector(state => state.dashboard);
  const [showDialog, toggleData] = useDialog(false);

  const initState = setEditorState(dashboard.activeChart);

  // Set initial state
  const {
    values: localState,
    handleChange,
    handleChangeArr,
    handleChangeObj,
    handleCheckbox,
    formFieldsUpdate,
  } = useForm(initState);

  const notifyResult = useNotifier();

  const dispatch = useDispatch();
  const { button, button2, button3, button4, scrollPaper, toolbar, typography } = useStyles();

  // Reference values
  const { dataObj, selectedDataset = {}, selectedSource = {}, sourceType, chartID } = localState;

  // almost all of the code expect eclRef to look like useRef object, to avoid changing everything we wrap ecl values in object.
  const eclRef = { current: localState.ecl };

  const handleError = error => {
    const message = createErrorMessage(error);
    formFieldsUpdate({
      error: message,
      errors: error?.payload?.data?.errors || [],
      dataObj: { error: message, loading: false },
    });
    notifyResult('warning', 'Something is not right, please check your inputs');
    return dispatch(error);
  };

  // Update chart in DB and store
  const editChart = async event => {
    event.preventDefault();
    if (event.nativeEvent.submitter.name === 'update') {
      return updateChartPreview();
    }
    const { chartID, configuration, dataset } = localState;
    const { isStatic } = configuration;
    const { id: dashboardID } = dashboard;

    if (isStatic) {
      const chartObj = { id: chartID, configuration: { ...configuration, dataset, ecl: {} } };

      try {
        const action = await updateChart(chartObj, dashboardID);
        dispatch(action);
        return toggleDialog();
      } catch (error) {
        return handleError(error);
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
        const updatedChart = await updateChart(updatedChartObj, dashboardID);
        dispatch(updatedChart); // updates chartConfig
        // dispatch(refreshDataByChartIds([chartID])); // updates Data
        return toggleDialog();
      } catch (error) {
        return handleError(error);
      }
    }
  };

  const updateChartPreview = async () => {
    const { dataset, params, selectedSource: source, sourceType } = localState;

    if (sourceType === 'ecl') {
      eclRef.current.toggleUpdate = !eclRef.current.toggleUpdate;
      return formFieldsUpdate({ ecl: eclRef.current });
    }

    try {
      handleChange(null, { name: 'dataObj', value: { loading: true } });
      const options = { dataset, params, source };
      const data = await getChartPreviewData(dashboard.cluster.id, options, sourceType);
      formFieldsUpdate({ error: '', dataObj: { data, loading: false } });
    } catch (error) {
      formFieldsUpdate({
        error: error.message,
        dataObj: { error: error.message, loading: false },
      });
    }
  };

  const checkDisabled = () => {
    if (localState.configuration.isStatic) return false;
    if (sourceType === 'ecl') {
      return !eclRef.current.data;
    } else {
      return !selectedDataset?.name || !selectedSource?.name || dataObj.loading;
    }
  };

  const eclData = eclRef.current?.data;
  const fileOrQueryData = dataObj?.data?.data;
  return (
    <Fragment>
      <Dialog scroll='paper' open={show} fullWidth maxWidth='xl' classes={{ paperScrollPaper: scrollPaper }}>
        <form onSubmit={editChart}>
          <Toolbar className={toolbar}>
            <Typography variant='h6' color='inherit' className={typography}>
              Edit Chart
            </Typography>
            <Button
              className={clsx(button2, button3)}
              disabled={!eclData && !fileOrQueryData}
              onClick={() => toggleData(chartID)}
            >
              <TableChartIcon />
            </Button>

            <Button className={clsx(button2, button4)} disabled={checkDisabled()} type='submit' name='update'>
              <RefreshIcon />
            </Button>
          </Toolbar>
          <DialogContent dividers>
            <ChartEditor
              dashboard={dashboard}
              eclRef={eclRef}
              handleChange={handleChange}
              handleChangeArr={handleChangeArr}
              handleChangeObj={handleChangeObj}
              handleCheckbox={handleCheckbox}
              localState={localState}
              formFieldsUpdate={formFieldsUpdate}
            />
          </DialogContent>
          <DialogActions>
            <Button variant='contained' color='secondary' onClick={toggleDialog}>
              Cancel
            </Button>
            <Button
              type='submit'
              name='save'
              variant='contained'
              className={button}
              disabled={checkDisabled()}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {showDialog && (
        <DataSnippetDialog
          data={fileOrQueryData || eclData || []}
          show={showDialog}
          toggleDialog={toggleData}
        />
      )}
    </Fragment>
  );
};

export default EditChartDialog;
