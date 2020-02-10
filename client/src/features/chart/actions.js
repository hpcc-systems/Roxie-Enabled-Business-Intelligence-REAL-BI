import axios from 'axios';
import { ADD_CHART, DELETE_CHART, GET_CHARTS, SET_CHART_ERRORS } from './';

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

const addChart = async chart => {
  let response;

  try {
    response = await axios.post('/api/chart/create', { chart });
  } catch (err) {
    console.error(err);
    return { type: SET_CHART_ERRORS, payload: err };
  }

  // prefix id created by DB to chart object
  chart = { id: response.data.chartID, ...chart };

  return { type: ADD_CHART, payload: chart };
};

const deleteChart = async (charts, chartID) => {
  try {
    await axios.delete('/api/chart/delete', { params: { chartID } });
  } catch (err) {
    console.error(err);
    return { type: SET_CHART_ERRORS, payload: err };
  }

  // Remove selected chart from array
  charts = charts.filter(({ id }) => id !== chartID);

  return { type: DELETE_CHART, payload: charts };
};

export { addChart, deleteChart, getCharts };
