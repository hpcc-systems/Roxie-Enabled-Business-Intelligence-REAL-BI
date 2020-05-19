import axios from 'axios';
import { SET_AUTH_ERRORS, SET_AUTH_USER, SET_DIRECTORY_DEPTH, SET_LAST_DASHBOARD } from './';

//Constants
import { initUserObj } from '../../constants';

const loginUser = async ({ username, password }) => {
  let response;

  try {
    response = await axios.post('/api/auth/login', { username, password });
  } catch (err) {
    return { action: { type: SET_AUTH_ERRORS, payload: { msg: err.response.data } } };
  }

  const { token, ...user } = response.data;
  localStorage.setItem('realBIToken', token);

  return { action: { type: SET_AUTH_USER, payload: user }, token };
};

const getLatestUserData = async () => {
  let response;

  try {
    response = await axios.get('/api/usersettings/getdata');
  } catch (err) {
    console.error(err);
    return { type: SET_AUTH_ERRORS, payload: err };
  }

  return { type: SET_AUTH_USER, payload: response.data };
};

const updateLastDashboard = async dashboardID => {
  try {
    await axios.put('/api/usersettings/updatelastdashboard', { dashboardID });
  } catch (err) {
    console.error(err);
    return { type: SET_AUTH_ERRORS, payload: err };
  }

  return { type: SET_LAST_DASHBOARD, payload: dashboardID };
};

const updateDirectoryDepth = async directoryDepth => {
  try {
    await axios.put('/api/usersettings/updatedirectorydepth', { directoryDepth });
  } catch (err) {
    console.error(err);
    return { type: SET_AUTH_ERRORS, payload: err };
  }

  return { type: SET_DIRECTORY_DEPTH, payload: directoryDepth };
};

const logoutUser = () => {
  return { type: SET_AUTH_USER, payload: initUserObj };
};

export { getLatestUserData, loginUser, logoutUser, updateDirectoryDepth, updateLastDashboard };
