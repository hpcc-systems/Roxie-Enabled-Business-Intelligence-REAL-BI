import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, Toolbar, Typography } from '@material-ui/core';
import { Refresh as RefreshIcon, TableChart as TableChartIcon } from '@material-ui/icons';
import clsx from 'clsx';
import { useHistory, useParams } from 'react-router-dom';

// Redux Actions
import { createChart } from '../../features/dashboard/actions';

// React Components
import ChartEditor from '../ChartEditor';
import DataSnippetDialog from './DataSnippet';

// React Hooks
import useForm from '../../hooks/useForm';
import useDialog from '../../hooks/useDialog';

// Utils
import { createChartObj } from '../../utils/chart';
import { createSource, createSourceObj } from '../../utils/source';
import { getChartPreviewData } from '../../utils/hpcc';
import { validateSource } from '../../utils/validate';
import useNotifier from '../../hooks/useNotifier';
import { createErrorMessage } from '../../utils/misc';

const initState = {
  configuration: {
    axis1: { showTickLabels: true },
    axis2: { showTickLabels: true },
    axis3: { showTickLabels: true },
    drillDown: {
      hasDrillDown: false,
      drilledByField: '',
      drilledOptions: [],
    },
    fields: [{ color: '#FFF', label: '', name: '', asLink: false, linkBase: '' }],
    type: 'bar',
    textBoxAlignText: 'left',
    graphChart: {
      config: {
        nodesField: '',
        edgesField: '',
        rankdir: 'LR',
        strokeColor: '#8d323c ',
      },
      nodes: [],
      edges: [],
    },
    mapMarkers: [
      {
        id: null,
        longitude: '',
        latitude: '',
        markerIcon: '',
        markerColor: '#C62136',
        popUpInfo: [{ id: null, datafieldName: '', label: '' }],
      },
    ],
  },
  ecl: { loading: false, toggleUpdate: false },
  dataObj: { loading: false },
  dataset: '',
  datasets: [],
  error: '',
  errors: [],
  keyword: '',
  params: [],
  sources: [],
  selectedDataset: { loading: false, name: '', fields: [] },
  selectedSource: {},
  sourceType: 'query',
  targetCluster: '',
  keywordfromExplorer: false,
  isAutoCompleteLoading: false,
  isIntegration: false,
};

// Create styles
const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
  },
  button2: { minWidth: 20 },
  button3: { marginRight: theme.spacing(1) },
  button4: { marginRight: theme.spacing(2) },
  scrollPaper: {
    maxHeight: '100%',
  },
  toolbar: { padding: 0 },
  typography: { flex: 1, marginLeft: 12 },
}));

const NewChartDialog = ({ show, toggleDialog }) => {
  const [showDialog, toggleData] = useDialog(false);

  const notifyResult = useNotifier();

  const {
    values: localState,
    handleChange,
    handleChangeArr,
    handleChangeObj,
    handleCheckbox,
    formFieldsUpdate,
  } = useForm(initState);

  // almost all of the code expect eclRef to look like useRef object, to avoid changing everything we wrap ecl values in object.
  const eclRef = { current: localState.ecl };

  const { dashboard } = useSelector(state => state.dashboard);
  const dispatch = useDispatch();
  const { button, button2, button3, button4, scrollPaper, toolbar, typography } = useStyles();

  const { workspaceID, fileName } = useParams();
  const history = useHistory();
  // Reference values
  const { dataObj, selectedDataset, selectedSource, sourceType } = localState;

  useEffect(() => {
    if (fileName || dashboard.fileName) {
      formFieldsUpdate({
        isIntegration: true,
        sourceType: 'file',
        keyword: fileName || dashboard.fileName,
      });
    }
  }, []);

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

  // Add components to DB
  const newChart = async event => {
    event.preventDefault();
    if (event.nativeEvent.submitter.name === 'update') {
      return updateChartPreview();
    }
    const { configuration, dataset } = localState;
    const { isStatic } = configuration;
    const { id: dashboardID } = dashboard;
    let sourceID;

    if (isStatic) {
      const chartObj = { configuration: { ...configuration, dataset, ecl: {} } };
      try {
        const action = await createChart(chartObj, dashboardID, null);
        dispatch(action); // { type: CREATE_CHART, payload: response.data };
        notifyResult('success', 'New item has been added to dashboard');
        return toggleDialog();
      } catch (error) {
        return handleError(error);
      }
    } else {
      try {
        // Validate user input
        validateSource(localState, eclRef);
      } catch (errors) {
        return handleChange(null, { name: 'errors', value: errors });
      }

      const sourceObj = createSourceObj(localState, eclRef.current);
      const newChartObj = createChartObj(localState, eclRef.current);

      try {
        const newSource = await createSource(sourceObj);
        sourceID = newSource.id;
      } catch (error) {
        return handleChange(null, { name: 'error', value: error.message });
      }

      try {
        const chartObj = { configuration: newChartObj };
        const action = await createChart(chartObj, dashboardID, sourceID);
        dispatch(action); // { type: CREATE_CHART, payload: response.data };
        notifyResult('success', 'New item has been added to dashboard');
        history.push(`/workspace/${workspaceID}`);
        return toggleDialog();
      } catch (error) {
        return handleError(error);
      }
    }
  };

  const updateChartPreview = async () => {
    const { dataset, params, selectedSource: source, sourceType } = localState;

    if (sourceType === 'ecl' || localState.configuration.isStatic) {
      eclRef.current.toggleUpdate = !eclRef.current.toggleUpdate;
      return formFieldsUpdate({ ecl: eclRef.current });
    }

    const populatedParams = params.filter(({ value }) => value !== '');

    try {
      handleChange(null, { name: 'dataObj', value: { loading: true } });
      const options = { dataset, params: populatedParams, source };
      const data = await getChartPreviewData(dashboard.cluster.id, options, sourceType);
      formFieldsUpdate({
        error: '',
        dataObj: { data, loading: false },
      });
    } catch (error) {
      formFieldsUpdate({
        error: error.message,
        dataObj: { error: error.message, loading: false },
      });
    }
  };

  const checkDisabled = () => {
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
        <form onSubmit={newChart}>
          <Toolbar className={toolbar}>
            <Typography variant='h6' color='inherit' className={typography}>
              New Chart
            </Typography>
            <Button
              className={clsx(button2, button3)}
              disabled={!eclData && !fileOrQueryData}
              onClick={toggleData}
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
              formFieldsUpdate={formFieldsUpdate}
              localState={localState}
              initialChartFormFields={initState}
            />
          </DialogContent>
          <DialogActions>
            <Button color='secondary' onClick={toggleDialog}>
              Cancel
            </Button>
            <Button type='submit' name='save' variant='contained' className={button}>
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

export default NewChartDialog;
