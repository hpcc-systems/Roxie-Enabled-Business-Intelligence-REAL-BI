import axios from 'axios';
import errHandler from './errHandler';

export const getDashboardData = async (clusterID, dashboardID) => {
  let response;

  try {
    response = await axios.get('/api/source/data/single', { params: { clusterID, dashboardID } });
  } catch (err) {
    console.error(err);
    return {};
  }

  return response.data;
};

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

  relationsArr.push({ sourceChart: '', sourceField: '', targetChart: '', targetField: '' });

  return relationsArr;
};

export const deleteRelations = (relations = {}, chartID) => {
  let newRelations = relations || {};

  // Remove interactions where the deleted chart is the source
  delete newRelations[chartID];

  const keys = Object.keys(newRelations);

  // Interate through each key in object
  keys.forEach(key => {
    // Get relations where the target chart is not the chart being deleted
    const filteredArr = newRelations[key].filter(({ targetChart }) => chartID !== targetChart);

    if (filteredArr.length === 0) {
      // No relations left for source chart, delete the key
      delete newRelations[key];
    } else {
      // Replace array at current key with filtered array
      newRelations[key] = filteredArr;
    }
  });

  return newRelations;
};
