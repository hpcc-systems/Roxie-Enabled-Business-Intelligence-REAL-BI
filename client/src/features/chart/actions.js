import axios from 'axios';
import { ADD_CHART, DELETE_CHART, GET_CHARTS, SET_CHART_ERRORS, UPDATE_CHART } from './';

const getCharts = async dashboardID => {
  let response;

  try {
    response = await axios.get('/api/chart/all', { params: { dashboardID } });
  } catch (err) {
    console.error(err);
    return { type: SET_CHART_ERRORS, payload: err };
  }

  return { type: GET_CHARTS, payload: response.data };
};

const addChart = async (chart, dashboardID, queryID, queryName) => {
  let response;

  try {
    response = await axios.post('/api/chart/create', { chart, dashboardID, queryID });
  } catch (err) {
    console.error(err);
    return { type: SET_CHART_ERRORS, payload: err };
  }

  return { type: ADD_CHART, payload: { ...response.data, queryName } };
};

const deleteChart = async (chartID, dashboardID, queryID) => {
  let response;

  try {
    response = await axios.delete('/api/chart/delete', { params: { chartID, dashboardID, queryID } });
  } catch (err) {
    console.error(err);
    return { type: SET_CHART_ERRORS, payload: err };
  }

  return { type: DELETE_CHART, payload: response.data };
};

const updateChart = async (chart, dashboardID, queryID) => {
  let response;

  try {
    response = await axios.put('/api/chart/update', { chart, dashboardID, queryID });
  } catch (err) {
    console.error(err);
    return { type: SET_CHART_ERRORS, payload: err };
  }

  return { type: UPDATE_CHART, payload: response.data };
};

export { addChart, deleteChart, getCharts, updateChart };
