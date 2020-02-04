import axios from 'axios';
import { ADD_CHART, ADD_DASHBOARD, GET_DASHBOARD, GET_DASHBOARDS, SET_DASHBOARD_ERRORS } from './';

const addChart = async (charts, chartObj) => {
  try {
    await axios.post('/api/chart/create', { chartObj });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  charts = [...charts, chartObj];

  return { type: ADD_CHART, payload: charts };
};

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

export { addChart, addDashboard, getDashboard, getDashboards };
