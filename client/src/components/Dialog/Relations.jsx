import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import { Remove as RemoveIcon } from '@material-ui/icons';

// Redux Actions
import { updateDashboard } from '../../features/dashboard/actions';

// Utils
import { formatRelations } from '../../utils/dashboard';
import { hasClickEventOption } from '../../utils/misc';

// Create styles
const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
  },
  button2: {
    margin: theme.spacing(2.5, 0, 0, 1),
    minWidth: 30,
    padding: 0,
  },
  dialog: { minWidth: '70vw', maxWidth: '70vw' },
  grid: { marginBottom: theme.spacing(3.5) },
}));

// Dropdown component to choose from a list of charts on the dashboard
const chartDropdown = (label, name, arr, field, index, updateArr) => {
  if (name === 'sourceChart') {
    // Filter list of charts to ones that support click events
    arr = arr.filter(chart => hasClickEventOption(chart.type));
  }

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select name={name} value={field || ''} onChange={event => updateArr(event, index)}>
        {arr.map(({ chartID, title }, index) => {
          title = !title ? 'No Chart Title' : title;

          return (
            <MenuItem key={index} value={chartID}>
              {title}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

// Dropdown component to select field for a particular chart
const fieldDropdown = (label, name, arr, chartID, field, index, updateArr) => {
  let fieldsArr = [];

  // Confirm chart was chosen, array exists, and fields exist in first object
  if (chartID && arr.length > 0) {
    const chart = arr.find(obj => obj.chartID === chartID);

    if (name === 'sourceField') {
      fieldsArr = chart.fields || [];
    } else {
      fieldsArr = chart.params || [];
    }
  }

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select name={name} value={field || ''} onChange={event => updateArr(event, index)}>
        {fieldsArr.map(({ name }, index) => {
          return (
            <MenuItem key={index} value={name}>
              {name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

const Relations = ({ show, toggleDialog }) => {
  const { dashboard } = useSelector(state => state.dashboard);
  const relationsArr = formatRelations(dashboard.relations);

  const [relations, setRelations] = useState(relationsArr);
  const dispatch = useDispatch();
  const { button, button2, dialog, grid } = useStyles();

  let { charts } = useSelector(state => state.chart);

  // Configure charts to get formatted array of objects
  charts = charts.map(chart => {
    const { id: chartID, config, sourceID, sourceName } = chart;
    const { axis1, axis2, fields = [], groupBy = '', params, title, type } = config;
    const newFields = [];

    // Get fields from chart config
    if (axis1.value) {
      newFields.push({ name: axis1.label || axis1.value });
    }

    if (axis2.value) {
      newFields.push({ name: axis2.label || axis2.value });
    }

    // Table fields are stored here
    if (fields.length > 0) {
      fields.forEach(field => newFields.push({ name: field }));
    }

    // Include group by as available field
    if (groupBy !== '') {
      newFields.push({ name: groupBy });
    }

    return { chartID, fields: newFields, params, sourceID, sourceName, title, type };
  });

  const updateField = (event, index) => {
    const { name, value } = event.target;
    const newRelationsArr = new Array(...relations);

    // Update index
    newRelationsArr[index] = { ...newRelationsArr[index], [name]: value };

    // Add new object to end of array for next entry
    if (newRelationsArr.length - 1 === index) {
      newRelationsArr.push({ sourceChart: '', sourceField: '', targetChart: '', targetField: '' });
    }

    setRelations(newRelationsArr);
  };

  const removeRelation = index => {
    const newRelationsArr = new Array(...relations);

    newRelationsArr.splice(index, 1);

    // Array is empty, add an empty object
    if (newRelationsArr.length === 0) {
      newRelationsArr.push({ sourceChart: '', sourceField: '', targetChart: '', targetField: '' });
    }

    return setRelations(newRelationsArr);
  };

  const saveRelations = () => {
    // Get array of objects that are complete
    const filteredRelations = relations.filter(({ sourceChart, sourceField, targetChart, targetField }) => {
      return sourceChart !== '' && sourceField !== '' && targetChart !== '' && targetField !== '';
    });
    // Get list of unique source chart ID's
    const sourceCharts = [...new Set(filteredRelations.map(({ sourceChart }) => sourceChart))];
    const formattedRelations = {};

    sourceCharts.forEach(chartID => {
      const foundRelations = filteredRelations.filter(({ sourceChart }) => sourceChart === chartID);
      const formattedObjects = foundRelations.map(({ sourceField, targetChart, targetField }) => ({
        sourceField,
        targetChart,
        targetField,
      }));

      return (formattedRelations[chartID] = formattedObjects);
    });

    updateDashboard({ ...dashboard, relations: formattedRelations }).then(action => {
      toggleDialog();
      dispatch(action);
    });
  };

  return (
    <Dialog
      onClose={toggleDialog}
      open={show}
      fullWidth
      classes={{ paper: charts.length > 1 ? dialog : null }}
    >
      <DialogTitle>Chart Relations</DialogTitle>
      <DialogContent>
        {charts.length <= 1 ? (
          <Typography variant='h6' color='inherit' align='center'>
            Insufficient Number of Charts
          </Typography>
        ) : (
          <Grid container direction='row' spacing={1} className={grid}>
            {relations.map(({ sourceChart, sourceField, targetChart, targetField }, index) => {
              const isPopulated = Boolean(sourceChart || sourceField || targetChart || targetField);

              return (
                <Fragment key={index}>
                  {isPopulated && (
                    <Grid item xs={1}>
                      <Button className={button2} onClick={() => removeRelation(index)}>
                        <RemoveIcon />
                      </Button>
                    </Grid>
                  )}
                  <Grid item xs={isPopulated ? 2 : 3}>
                    {chartDropdown('Source Chart', 'sourceChart', charts, sourceChart, index, updateField)}
                  </Grid>
                  <Grid item xs={3}>
                    {fieldDropdown(
                      'Source Chart Field',
                      'sourceField',
                      charts,
                      sourceChart,
                      sourceField,
                      index,
                      updateField,
                    )}
                  </Grid>
                  <Grid item xs={3}>
                    {chartDropdown('Target Chart', 'targetChart', charts, targetChart, index, updateField)}
                  </Grid>
                  <Grid item xs={3}>
                    {fieldDropdown(
                      'Target Chart Field',
                      'targetField',
                      charts,
                      targetChart,
                      targetField,
                      index,
                      updateField,
                    )}
                  </Grid>
                </Fragment>
              );
            })}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button color='secondary' variant='contained' onClick={toggleDialog}>
          Cancel
        </Button>
        <Button className={button} variant='contained' onClick={saveRelations} disabled={charts.length <= 1}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Relations;
