import axios from 'axios';

const getDashboardData = async (clusterID, dashboardID) => {
  let response;

  try {
    response = await axios.get('/api/query/data/single', { params: { clusterID, dashboardID } });
  } catch (err) {
    console.error(err);
    return {};
  }

  return response.data;
};

const addDashboard = async dashboard => {
  let response;

  try {
    response = await axios.post('/api/dashboard/create', dashboard);
  } catch (err) {
    console.error(err);
    return {};
  }

  return response.data;
};

const getDirectory = async () => {
  let response;

  try {
    response = await axios.get('/api/user/directory');
  } catch (err) {
    console.error(err);
    return [];
  }

  return response.data;
};

const updateDirectory = async directory => {
  try {
    await axios.put('/api/user/updatedirectory', { directory });
  } catch (err) {
    console.error(err);
  }

  return;
};

export { addDashboard, getDashboardData, getDirectory, updateDirectory };
