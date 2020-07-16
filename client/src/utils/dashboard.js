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

export const addDashboardToDB = async dashboard => {
  let response;

  try {
    response = await axios.post('/api/dashboard/create', dashboard);
  } catch (err) {
    const { errMsg } = errHandler(err);

    throw errMsg;
  }

  return response.data;
};

export const updateDirectory = async directory => {
  try {
    await axios.put('/api/user/updatedirectory', { directory });
  } catch (err) {
    console.error(err);
  }

  return;
};

export const updateDirectoryDepth = async directoryDepth => {
  try {
    await axios.put('/api/user/updatedirectorydepth', { directoryDepth });
  } catch (err) {
    console.error(err);
  }

  return;
};

export const updateDashboardInDB = async stateObj => {
  try {
    await axios.put('/api/dashboard', { ...stateObj });
  } catch (err) {
    const { errMsg } = errHandler(err);

    throw errMsg;
  }

  return;
};

export const deleteDashboardInDB = async dashboardID => {
  try {
    await axios.delete('/api/dashboard', { params: { dashboardID } });
  } catch (err) {
    console.error(err);
  }

  return;
};
