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

export const updateDashboard = async dashboardObj => {
  try {
    await axios.put('/api/dashboard', { ...dashboardObj });
  } catch (err) {
    const { errMsg } = errHandler(err);

    throw errMsg;
  }

  return;
};

export const deleteExistingDashboard = async dashboardID => {
  try {
    await axios.delete('/api/dashboard', { params: { dashboardID } });
  } catch (err) {
    console.error(err);
  }

  return;
};
