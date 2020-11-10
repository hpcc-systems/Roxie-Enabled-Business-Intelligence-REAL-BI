import axios from 'axios';

export const shareChart = async (email, dashboardID) => {
  console.log('API ', email);

  try {
    await axios.post('/api/v1/chart/share', { email, dashboardID });
  } catch (err) {
    console.error(err);
  }

  return;
};

export const getUsers = async () => {
  try {
    const response = await axios.get('/api/v1/user/all');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
