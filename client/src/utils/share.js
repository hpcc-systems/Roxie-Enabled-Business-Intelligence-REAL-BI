import axios from 'axios';
import errHandler from './errHandler';

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
    const { errMsg } = errHandler(err);

    return errMsg;
  }

  return response.data;
};

export { shareChart, getUsers };
