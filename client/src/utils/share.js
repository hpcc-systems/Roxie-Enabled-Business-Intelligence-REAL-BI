import axios from 'axios';

const shareChart = async (email, dashboardID) => {
  console.log('API ', email);

  try {
    await axios.post('/api/chart/share', { email, dashboardID });
  } catch (err) {
    console.error(err);
  }

  return;
};

const getUsers = async () => {
  let response;

  try {
    response = await axios.get('/api/user/all');
  } catch (err) {
    console.error(err);
    return [];
  }

  return response.data;
};

export { shareChart, getUsers };
