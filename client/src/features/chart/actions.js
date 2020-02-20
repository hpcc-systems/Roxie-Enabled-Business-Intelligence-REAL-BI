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

const addChart = async chart => {
  let response;

  try {
    response = await axios.post('/api/chart/create', { chart });
  } catch (err) {
    console.error(err);
    return { type: SET_CHART_ERRORS, payload: err };
  }

  // prefix id created by DB to chart object
  const { id } = response.data;
  chart = { id, ...chart };

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

const updateChart = async (charts, chart) => {
  const { id: chartID } = chart;

  try {
    await axios.put('/api/chart/update', { chart });
  } catch (err) {
    console.error(err);
    return { type: SET_CHART_ERRORS, payload: err };
  }

  // Update selected chart in array
  const chartIndex = charts.map(({ id }) => id).indexOf(chartID);
  const selectedChart = charts[chartIndex];
  charts[chartIndex] = { ...selectedChart, ...chart };

  return { type: UPDATE_CHART, payload: charts };
};

export { addChart, deleteChart, getCharts, updateChart };
