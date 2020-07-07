import axios from 'axios';


//.env prop
const { REACT_APP_PROXY_URL } = process.env;

export const getDashboardData = async (clusterID, dashboardID) => {

  let response;

  try {
    response = await axios.get(`${REACT_APP_PROXY_URL}/api/source/data/single`, {
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
    response = await axios.post(`${REACT_APP_PROXY_URL}/api/dashboard/create`, dashboard);
  } catch (err) {
    console.error(err);
    return {};
  }

  return response.data;
};

export const updateDirectory = async directory => {
  try {
    await axios.put(`${REACT_APP_PROXY_URL}/api/user/updatedirectory`, { directory });
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
    console.error(err);
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
