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

export const updateRelations = (chartID, dashboard, relationsArr) => {
  let newRelations = dashboard.relations || {};

  // Remove any relations that are not complete
  relationsArr = relationsArr.filter(
    ({ originField, mappedChart, mappedField }) =>
      originField !== '' && mappedChart !== '' && mappedField !== '',
  );

  // Replace or create key/value pair in relations object
  newRelations[chartID] = relationsArr;

  relationsArr.forEach(obj => {
    newRelations = createInverseRelation(chartID, obj, newRelations);
  });

  return newRelations;
};

const createInverseRelation = (chartID, originalRelationObj, masterRelationsObj) => {
  const { originField, mappedChart, mappedField } = originalRelationObj;
  const targetChartID = mappedChart;
  const inverseRelationObj = { originField: mappedField, mappedChart: chartID, mappedField: originField };
  const targetArray = masterRelationsObj[targetChartID];

  // Look for existing nested object
  if (targetArray && targetArray.length > 0) {
    const targetIndex = targetArray.findIndex(
      ({ mappedChart, mappedField }) =>
        mappedChart === inverseRelationObj.mappedChart && mappedField === inverseRelationObj.mappedField,
    );

    if (targetIndex > -1) {
      masterRelationsObj[targetChartID][targetIndex] = inverseRelationObj;
    } else {
      masterRelationsObj[targetChartID].push(inverseRelationObj);
    }
  } else {
    // Create array with inverse object on relations object
    masterRelationsObj[targetChartID] = [inverseRelationObj];
  }

  console.log('masterRelationsObj', masterRelationsObj);

  return masterRelationsObj;
};
