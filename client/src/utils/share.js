import axios from 'axios';
const { URL_ROOT } = process.env;

const shareChart = async (email, dashboardID) => {
  console.log('API ', email);
  let response;

  let url = URL_ROOT + '/dashboard/' + dashboardID;
  try {
    response = await axios.post('/api/chart/share', { email, dashboardID, url });
  } catch (err) {
    console.error(err);
    return [];
  }
  return response.data;
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
