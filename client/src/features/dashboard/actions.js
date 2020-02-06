import axios from 'axios';
import {
  ADD_CHART,
  ADD_DASHBOARD,
  DELETE_CHART,
  GET_DASHBOARD,
  GET_DASHBOARDS,
  SET_DASHBOARD_ERRORS,
} from './';

const addChart = async chart => {
  let response;

  try {
    response = await axios.post('/api/chart/create', { chart });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  // prefix id created by DB to chart object
  chart = { id: response.data.chartID, ...chart };

  return { type: ADD_CHART, payload: chart };
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

const deleteChart = async (charts, chartID) => {
  try {
    await axios.delete('/api/chart/delete', { params: { chartID } });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  // Remove selected chart from array
  charts = charts.filter(({ id }) => id !== chartID);

  return { type: DELETE_CHART, payload: charts };
};

export { addChart, addDashboard, deleteChart, getDashboard, getDashboards };
