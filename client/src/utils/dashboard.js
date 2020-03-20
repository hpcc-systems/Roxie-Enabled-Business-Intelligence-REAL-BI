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

export { getDashboardData };
