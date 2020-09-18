import axios from 'axios';
import errHandler from './errHandler';

export const createDashboard = async (dashboard, workspaceID) => {
  let response;

  try {
    response = await axios.post('/api/dashboard', { dashboard, workspaceID });
  } catch (err) {
    const { errMsg } = errHandler(err);

    throw errMsg;
  }

  return response.data;
};

export const deleteExistingDashboard = async dashboardID => {
  try {
    await axios.delete('/api/dashboard', { params: { dashboardID } });
  } catch (err) {
    console.error(err);
  }

  return;
};

export const formatRelations = relations => {
  // Get array of sourceChart ID's
  const sourceCharts = Object.keys(relations || {});
  const relationsArr = [];

  // Flatten nested relations object into flat array of objects
  sourceCharts.forEach(sourceChart => {
    const chartRelations = relations[sourceChart];

    chartRelations.forEach(relation => {
      return relationsArr.push({ sourceChart, ...relation });
    });
  });

  // Add new relation to end of array
  relationsArr.push({ sourceChart: '', sourceField: '', targetChart: '', targetField: '' });

  return relationsArr;
};

export const deleteRelations = (relations = {}, chartID) => {
  let newRelations = relations || {};

  // Remove interactions where the deleted chart is the source
  delete newRelations[chartID];

  // Get list of source chart ID's
  const sourceCharts = Object.keys(newRelations);

  // Interate through each source chart id in object
  sourceCharts.forEach(sourceChart => {
    // Get relations where the target chart is not the chart being deleted
    const filteredArr = newRelations[sourceChart].filter(({ targetChart }) => chartID !== targetChart);

    if (filteredArr.length === 0) {
      // No relations left for source chart, delete the sourceChart
      delete newRelations[sourceChart];
    } else {
      // Replace array for current source chart with filtered array
      newRelations[sourceChart] = filteredArr;
    }
  });

  return newRelations;
};

export const createFilterObj = (localState, ecl) => {
  const {
    name,
    sourceDataset,
    sourceField,
    sourceID,
    sourceName,
    sourceType,
    params,
    value = '',
  } = localState;
  let newFilter = { name, sourceDataset, sourceField, sourceID, sourceName, sourceType, params, value };

  // Get array of objects that are complete
  const completeParams = params.filter(({ targetChart, targetParam }) => {
    return targetChart !== '' && targetParam !== '';
  });

  // Update params
  newFilter = { ...newFilter, params: completeParams };

  // Move ecl value to object root
  if (sourceType === 'ecl') {
    const newDataset = !ecl.dataset ? sourceDataset : ecl.dataset;

    newFilter = { ...newFilter, sourceDataset: newDataset };

    delete ecl.data;
    delete ecl.dataset;
  }

  return { ...newFilter, ecl };
};

export const deleteFilters = (filters = [], chartID) => {
  let newFilters = filters || {};

  newFilters = newFilters.map(filter => {
    const { params, ...vals } = filter;
    const newParams = params.filter(({ targetChart }) => targetChart !== chartID);

    if (newParams.length === 0) {
      return null;
    }

    return { ...vals, params: newParams };
  });

  // Remove any null entries
  newFilters = newFilters.filter(filter => filter != null);

  return newFilters;
};
