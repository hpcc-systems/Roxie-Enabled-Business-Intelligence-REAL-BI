import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { SET_AUTH_ERRORS, SET_AUTH_USER, SET_LAST_DASHBOARD } from './';

//Constants
import { initUserObj } from '../../constants';

const loginUser = async () => {
  let response;

  try {
    response = await axios.post('/api/auth/login', { userID: 1 });
  } catch (err) {
    console.error(err);
    return { type: SET_AUTH_ERRORS, payload: err };
  }

  const { jwt } = response.data;
  const user = jwt_decode(jwt);
  localStorage.setItem('realBIToken', jwt);

  return { action: { type: SET_AUTH_USER, payload: user }, token: jwt };
};

const getLatestUserData = async () => {
  let response;

  try {
    response = await axios.get('/api/user/getdata');
  } catch (err) {
    console.error(err);
    return { type: SET_AUTH_ERRORS, payload: err };
  }

  return { type: SET_AUTH_USER, payload: response.data };
};

const updateLastDashboard = async dashboardID => {
  try {
    await axios.put('/api/user/updatelastdashboard', { dashboardID });
  } catch (err) {
    console.error(err);
    return { type: SET_AUTH_ERRORS, payload: err };
  }

  return { type: SET_LAST_DASHBOARD, payload: dashboardID };
};

const logoutUser = () => {
  return { type: SET_AUTH_USER, payload: initUserObj };
};

export { getLatestUserData, loginUser, logoutUser, updateLastDashboard };
