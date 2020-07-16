import axios from 'axios';
import errHandler from './errHandler';

// Constants
const REACT_APP_SERVER_PROXY = process.env.REACT_APP_SERVER_PROXY;

const shareChart = async (email, dashboardID) => {
  console.log('API ', email);

  try {
    await axios.post(`${REACT_APP_SERVER_PROXY}/api/chart/share`, { email, dashboardID });
  } catch (err) {
    console.error(err);
  }

  return;
};

const getUsers = async () => {
  let response;

  try {
    response = await axios.get(`${REACT_APP_SERVER_PROXY}/api/user/all`);
  } catch (err) {
    const { errMsg } = errHandler(err);

    return errMsg;
  }

  return response.data;
};

export { shareChart, getUsers };
