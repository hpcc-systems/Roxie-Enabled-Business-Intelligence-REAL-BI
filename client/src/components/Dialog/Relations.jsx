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
import {
  createRelations,
  deleteExistingRelations,
  updateExistingRelations,
} from '../../features/dashboard/actions';

// Utils
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
const chartDropdown = (label, name, arr, field, index, updateArr, relationID) => {
  if (name === 'sourceChart') {
    // Filter list of charts to ones that support click events
    arr = arr.filter(chart => hasClickEventOption(chart.type));
  }

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select name={name} value={field || ''} onChange={event => updateArr(event, index, relationID)}>
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
const fieldDropdown = (label, name, arr, chartID, field, index, updateArr, relationID) => {
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
      <Select name={name} value={field || ''} onChange={event => updateArr(event, index, relationID)}>
        {fieldsArr.map(({ name, value }, index) => {
          return (
            <MenuItem key={index} value={value}>
              {name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

const newRelationEntry = { sourceID: '', sourceField: '', targetID: '', targetField: '' };

const Relations = ({ show, toggleDialog }) => {
  const { dashboard } = useSelector(state => state.dashboard);
  const { charts, id: dashboardID, relations: dashboardRelations } = dashboard;

  const [relations, setRelations] = useState([...dashboardRelations, newRelationEntry]);
  const [updatedRelations, setUpdatedRelations] = useState([]);
  const [deletedRelations, setDeletedRelations] = useState([]);
  const dispatch = useDispatch();
  const { button, button2, dialog, grid } = useStyles();

  // Configure charts to get formatted array of objects
  const formattedCharts = charts.map(chart => {
    const { id: chartID, configuration, source } = chart;
    const { axis1, axis2, fields = [], groupBy = {}, params = [], title, type } = configuration;
    const newFields = [];

    // Get fields from chart config
    if (axis1.value) {
      newFields.push({ name: axis1.label || axis1.value, value: axis1.value });
    }

    if (axis2.value) {
      newFields.push({ name: axis2.label || axis2.value, value: axis2.value });
    }

    // Table fields are stored here
    fields.forEach(field => {
      if (field.name !== '') {
        newFields.push({ name: field.label || field.name, value: field.name });
      }
    });

    // Include group by as available field
    if (groupBy.value !== '') {
      newFields.push({ name: groupBy.value, value: groupBy.value });
    }

    const formattedParams = params.map(({ name }) => ({ name, value: name }));

    return {
      chartID,
      fields: newFields,
      params: formattedParams,
      sourceID: source?.id,
      sourceName: source?.name,
      title,
      type,
    };
  });

  // Remove charts that do not have params that relations can use
  const targetCharts = formattedCharts.filter(chart => {
    const { params = [] } = chart;
    return params.length > 0;
  });

  const updateField = (event, index, relationID) => {
    const { name, value } = event.target;
    const newRelationsArr = new Array(...relations);
    newRelationsArr[index] = { ...newRelationsArr[index], [name]: value };

    // Add new object to end of array for next entry
    if (newRelationsArr.length - 1 === index) {
      newRelationsArr.push(newRelationEntry);
    }

    if (relationID && updatedRelations.indexOf(relationID) === -1) {
      setUpdatedRelations(prevState => [...prevState, relationID]);
    }

    setRelations(newRelationsArr);
  };

  const removeRelation = (index, relationID) => {
    const newRelationsArr = new Array(...relations);

    newRelationsArr.splice(index, 1);

    // Array is empty, add an empty object
    if (newRelationsArr.length === 0) {
      newRelationsArr.push(newRelationEntry);
    }

    if (deletedRelations.indexOf(relationID) === -1) {
      setDeletedRelations(prevState => [...prevState, relationID]);
    }

    return setRelations(newRelationsArr);
  };

  const saveRelations = async () => {
    // Get array of objects that are complete
    const filteredRelations = relations.filter(({ sourceID, sourceField, targetID, targetField }) => {
      return sourceID !== '' && sourceField !== '' && targetID !== '' && targetField !== '';
    });

    const newRelationsArr = filteredRelations.filter(({ id }) => !id);
    const updatedRelationsArr = filteredRelations.filter(({ id }) => updatedRelations.indexOf(id) > -1);
    const deletedRelationsArr = dashboardRelations.filter(({ id }) => deletedRelations.indexOf(id) > -1);

    try {
      await createRelations(dashboardID, newRelationsArr);
      await updateExistingRelations(dashboardID, updatedRelationsArr);
      const action = await deleteExistingRelations(dashboardID, deletedRelationsArr);

      dispatch(action);
      toggleDialog();
    } catch (error) {
      dispatch(error);
    }
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
        {formattedCharts.length <= 1 ? (
          <Typography variant='h6' color='inherit' align='center'>
            Insufficient Number of Charts
          </Typography>
        ) : (
          <Grid container direction='row' spacing={1} className={grid}>
            {relations.map(({ id, sourceID, sourceField, targetID, targetField }, index) => {
              const isPopulated = Boolean(sourceID || sourceField || targetID || targetField);

              return (
                <Fragment key={index}>
                  {isPopulated && (
                    <Grid item xs={1}>
                      <Button className={button2} onClick={() => removeRelation(index, id)}>
                        <RemoveIcon />
                      </Button>
                    </Grid>
                  )}
                  <Grid item xs={isPopulated ? 2 : 3}>
                    {chartDropdown(
                      'Source Chart',
                      'sourceID',
                      formattedCharts,
                      sourceID,
                      index,
                      updateField,
                      id,
                    )}
                  </Grid>
                  <Grid item xs={3}>
                    {fieldDropdown(
                      'Source Chart Field',
                      'sourceField',
                      formattedCharts,
                      sourceID,
                      sourceField,
                      index,
                      updateField,
                      id,
                    )}
                  </Grid>
                  <Grid item xs={3}>
                    {chartDropdown(
                      'Target Chart',
                      'targetID',
                      targetCharts,
                      targetID,
                      index,
                      updateField,
                      id,
                    )}
                  </Grid>
                  <Grid item xs={3}>
                    {fieldDropdown(
                      'Target Chart Field',
                      'targetField',
                      formattedCharts,
                      targetID,
                      targetField,
                      index,
                      updateField,
                      id,
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
