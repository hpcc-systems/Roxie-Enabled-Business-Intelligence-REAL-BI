import axios from 'axios';
import errHandler from './errHandler';

// Constants
const REACT_APP_SERVER_PROXY = process.env.REACT_APP_SERVER_PROXY;

export const getDashboardData = async (clusterID, dashboardID) => {
  let response;

  try {
    response = await axios.get(`${REACT_APP_SERVER_PROXY}/api/source/data/single`, {
      params: { clusterID, dashboardID },
    });
  } catch (err) {
    console.error(err);
    return {};
  }

  return response.data;
};

export const addDashboardToDB = async dashboard => {
  let response;

  try {
    response = await axios.post(`${REACT_APP_SERVER_PROXY}/api/dashboard/create`, dashboard);
  } catch (err) {
    const { errMsg } = errHandler(err);

    throw errMsg;
  }

  return response.data;
};

export const updateDirectory = async directory => {
  try {
    await axios.put(`${REACT_APP_SERVER_PROXY}/api/user/updatedirectory`, { directory });
  } catch (err) {
    console.error(err);
  }

  return;
};

export const updateDirectoryDepth = async directoryDepth => {
  try {
    await axios.put(`${REACT_APP_SERVER_PROXY}/api/user/updatedirectorydepth`, { directoryDepth });
  } catch (err) {
    console.error(err);
  }

  return;
};

export const updateDashboardInDB = async stateObj => {
  try {
    await axios.put(`${REACT_APP_SERVER_PROXY}/api/dashboard`, { ...stateObj });
  } catch (err) {
    const { errMsg } = errHandler(err);

    throw errMsg;
  }

  return;
};

export const deleteDashboardInDB = async dashboardID => {
  try {
    await axios.delete(`${REACT_APP_SERVER_PROXY}/api/dashboard`, { params: { dashboardID } });
  } catch (err) {
    console.error(err);
  }

  return;
};
