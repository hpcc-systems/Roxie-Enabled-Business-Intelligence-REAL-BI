import axios from 'axios';

//.env prop
const { REACT_APP_PROXY_URL } = process.env;

const shareChart = async (email, dashboardID) => {
  console.log('API ', email);

  try {
    await axios.post(`${REACT_APP_PROXY_URL}/api/chart/share`, { email, dashboardID });
  } catch (err) {
    console.error(err);
  }

  return;
};

const getUsers = async () => {
  let response;

  try {
    response = await axios.get(`${REACT_APP_PROXY_URL}/api/user/all`);
  } catch (err) {
    console.error(err);
    return [];
  }

  return response.data;
};

export { shareChart, getUsers };
