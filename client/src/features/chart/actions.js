import axios from 'axios';

// Action Types
export const ADD_CHART = 'ADD_CHART';
export const DELETE_CHART = 'DELETE_CHART';
export const GET_CHARTS = 'GET_CHARTS';
export const SET_CHART_ERRORS = 'SET_CHART_ERRORS';
export const UPDATE_CHART = 'UPDATE_CHART';

export const getCharts = async dashboardID => {
  let response;

  try {
    response = await axios.get('/api/chart/all', { params: { dashboardID } });
  } catch (err) {
    console.error(err);
    return { type: SET_CHART_ERRORS, payload: err };
  }

  return { type: GET_CHARTS, payload: response.data };
};

export const addChart = async (chart, dashboardID, sourceID, sourceName, sourceType) => {
  let response;

  try {
    response = await axios.post('/api/chart/create', { chart, dashboardID, sourceID });
  } catch (err) {
    console.error(err);
    return { type: SET_CHART_ERRORS, payload: err };
  }

  return { type: ADD_CHART, payload: { ...response.data, sourceName, sourceType } };
};

export const deleteChart = async (chartID, dashboardID, sourceID) => {
  let response;

  try {
    response = await axios.delete('/api/chart/delete', { params: { chartID, dashboardID, sourceID } });
  } catch (err) {
    console.error(err);
    return { type: SET_CHART_ERRORS, payload: err };
  }

  return { type: DELETE_CHART, payload: response.data };
};

export const updateChart = async (chart, dashboardID, sourceID) => {
  let response;

  try {
    response = await axios.put('/api/chart/update', { chart, dashboardID, sourceID });
  } catch (err) {
    console.error(err);
    return { type: SET_CHART_ERRORS, payload: err };
  }

  return { type: UPDATE_CHART, payload: response.data };
};
