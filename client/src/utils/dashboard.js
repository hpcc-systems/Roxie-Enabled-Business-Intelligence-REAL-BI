import axios from 'axios';

//.env prop
const { PROXY_URL } = process.env;

const getDashboardData = async (clusterID, dashboardID) => {
  let response;

  try {
    response = await axios.get(`${PROXY_URL}/api/source/data/single`, { params: { clusterID, dashboardID } });
  } catch (err) {
    console.error(err);
    return {};
  }

  return response.data;
};

const addDashboardToDB = async dashboard => {
  let response;

  try {
    response = await axios.post(`${PROXY_URL}/api/dashboard/create`, dashboard);
  } catch (err) {
    console.error(err);
    return {};
  }

  return response.data;
};

const updateDirectory = async directory => {
  try {
    await axios.put(`${PROXY_URL}/api/user/updatedirectory`, { directory });
  } catch (err) {
    console.error(err);
  }

  return;
};

export { addDashboardToDB, getDashboardData, updateDirectory };
