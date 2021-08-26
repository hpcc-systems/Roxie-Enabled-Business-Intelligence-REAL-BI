import React, { Fragment, useEffect, useRef } from 'react';
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
    mapFields: [{ label: '', name: '' }],
    type: 'bar',
    textBoxAlignText: 'left',
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
  dataObj: { loading: false },
  dataset: '',
  datasets: [],
  error: '',
  errors: [],
  keyword: '',
  params: [],
  sources: [],
  selectedDataset: {},
  selectedSource: {},
  sourceType: 'query',
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
  paper: {
    maxHeight: '85vh',
    minHeight: '63vh',
  },
  toolbar: { padding: 0 },
  typography: { flex: 1, marginLeft: 12 },
}));

const NewChartDialog = ({ show, toggleDialog, getChartData, addChartToLayout }) => {
  const [showDialog, toggleData] = useDialog(false);
  const {
    values: localState,
    handleChange,
    handleChangeArr,
    handleChangeObj,
    handleCheckbox,
    formFieldsUpdate,
  } = useForm(initState);
  const eclRef = useRef({});
  const { dashboard } = useSelector(state => state.dashboard);
  const dispatch = useDispatch();
  const { button, button2, button3, button4, paper, toolbar, typography } = useStyles();

  const { workspaceID, fileName } = useParams();
  const history = useHistory();
  // Reference values
  const {
    dataObj: { data = [], loading },
    selectedDataset = {},
    selectedSource = {},
    sourceType,
  } = localState;
  const sourceKeys = Object.keys(selectedSource).length;
  const datasetKeys = Object.keys(selectedDataset).length;

  useEffect(() => {
    if (fileName || dashboard.fileName) {
      formFieldsUpdate({
        isIntegration: true,
        sourceType: 'file',
        keyword: fileName || dashboard.fileName,
      });
    }
  }, []);

  // Add components to DB
  const newChart = async event => {
    event.preventDefault();
    const { configuration, dataset } = localState;
    const { isStatic, type } = configuration;
    const { id: dashboardID } = dashboard;
    let sourceID, sourceName, sourceType;

    if (type === 'textBox' && isStatic) {
      const chartObj = { ...configuration, dataset, ecl: {} };
      try {
        const action = await createChart(chartObj, dashboardID, null);
        dispatch(action);
        addChartToLayout(action.payload);
        return toggleDialog();
      } catch (error) {
        return dispatch(error);
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
        sourceName = newSource.name;
        sourceType = newSource.type;
      } catch (error) {
        return handleChange(null, { name: 'error', value: error.message });
      }

      try {
        const action = await createChart(newChartObj, dashboardID, sourceID, sourceName, sourceType);
        dispatch(action);
        getChartData([action.payload.id], {});
        addChartToLayout(action.payload);
        history.push(`/workspace/${workspaceID}`);
        return toggleDialog();
      } catch (error) {
        return dispatch(error);
      }
    }
  };

  const updateChartPreview = () => {
    const { dataset, params, selectedSource: source, sourceType } = localState;

    const populatedParams = params.filter(({ value }) => value !== '');

    if (sourceKeys > 0 && datasetKeys > 0) {
      (async () => {
        handleChange(null, { name: 'dataObj', value: { loading: true } });

        try {
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
      })();
    }
  };

  return (
    <Fragment>
      <Dialog open={show} fullWidth maxWidth='xl' classes={{ paper }}>
        <Toolbar className={toolbar}>
          <Typography variant='h6' color='inherit' className={typography}>
            New Chart
          </Typography>
          <Button
            className={clsx(button2, button3)}
            disabled={sourceKeys === 0 || datasetKeys === 0 || loading || data.length === 0}
            onClick={toggleData}
          >
            <TableChartIcon />
          </Button>
          {sourceType !== 'ecl' && (
            <Button
              className={clsx(button2, button4)}
              disabled={sourceKeys === 0 || datasetKeys === 0 || loading}
              onClick={updateChartPreview}
            >
              <RefreshIcon />
            </Button>
          )}
        </Toolbar>
        <form onSubmit={newChart}>
          <DialogContent>
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
            <Button type='submit' variant='contained' className={button}>
              Save
            </Button>
          </DialogActions>
        </form>
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

export default NewChartDialog;
