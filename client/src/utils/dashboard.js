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
