import axios from 'axios';
import {
  ADD_DASHBOARD,
  GET_DASHBOARD,
  GET_DASHBOARD_PARAMS,
  GET_DASHBOARDS,
  SET_DASHBOARD_ERRORS,
  UPDATE_DASHBOARD_PARAM,
} from './';

const addDashboard = async dashboard => {
  let response;

  try {
    response = await axios.post('/api/dashboard/create', dashboard);
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  return { type: ADD_DASHBOARD, payload: response.data };
};

const getDashboard = async dashboardID => {
  let response;

  try {
    response = await axios.get('/api/dashboard/info', { params: { dashboardID } });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  return { type: GET_DASHBOARD, payload: response.data };
};

const getDashboards = async () => {
  let response;

  try {
    response = await axios.get('/api/dashboard/all');
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  return { type: GET_DASHBOARDS, payload: response.data };
};

const getDashboardParams = async dashboardID => {
  let response;

  try {
    response = await axios.get('/api/param/all', { params: { dashboardID } });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  return { type: GET_DASHBOARD_PARAMS, payload: response.data };
};

const updateDashboardParam = async (dashboardID, paramID, value) => {
  let response;

  try {
    response = await axios.put('/api/param/update', { dashboardID, paramID, value });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  return { type: UPDATE_DASHBOARD_PARAM, payload: response.data };
};

export { addDashboard, getDashboard, getDashboards, getDashboardParams, updateDashboardParam };
