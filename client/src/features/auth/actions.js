import axios from 'axios';

//Constants
import { initUserObj } from '../../constants';
const REACT_APP_SERVER_PROXY = process.env.REACT_APP_SERVER_PROXY;

// Action Types
export const SET_AUTH_ERRORS = 'SET_AUTH_ERRORS';
export const SET_AUTH_USER = 'SET_AUTH_USER';
export const SET_DIRECTORY_DEPTH = 'SET_DIRECTORY_DEPTH';
export const SET_LAST_DASHBOARD = 'SET_LAST_DASHBOARD';

export const loginUser = async ({ username, password }) => {
  let response;

  try {
    response = await axios.post(`${REACT_APP_SERVER_PROXY}/api/auth/login`, { username, password });
  } catch (err) {
    return { action: { type: SET_AUTH_ERRORS, payload: { msg: err.response.data } } };
  }

  // Destructure response
  const { token, ...user } = response.data;

  return { action: { type: SET_AUTH_USER, payload: user }, lastDashboard: user.lastDashboard, token };
};

export const getLatestUserData = async () => {
  let response;

  try {
    response = await axios.get(`${REACT_APP_SERVER_PROXY}/api/user/getdata`);
  } catch (err) {
    console.error(err);
    return { type: SET_AUTH_ERRORS, payload: err };
  }

  // Get last dashboard id from response
  const { lastDashboard } = response.data;

  return { action: { type: SET_AUTH_USER, payload: response.data }, lastDashboard };
};

export const updateLastDashboard = async dashboardID => {
  try {
    await axios.put(`${REACT_APP_SERVER_PROXY}/api/user/updatelastdashboard`, { dashboardID });
  } catch (err) {
    console.error(err);
    return { type: SET_AUTH_ERRORS, payload: err };
  }

  return { type: SET_LAST_DASHBOARD, payload: dashboardID };
};

export const logoutUser = () => {
  return { type: SET_AUTH_USER, payload: initUserObj };
};
