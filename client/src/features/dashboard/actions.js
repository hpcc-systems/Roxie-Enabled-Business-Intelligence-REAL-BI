/* eslint-disable no-throw-literal */
import axios from 'axios';

// Action Types
export const CREATE_CHART = 'CREATE_CHART';
export const CREATE_FILTER = 'CREATE_FILTER';
export const DELETE_CHART = 'DELETE_CHART';
export const DELETE_FILTER = 'DELETE_FILTER';
export const GET_DASHBOARD = 'GET_DASHBOARD';
export const SET_DASHBOARD_ERRORS = 'SET_DASHBOARD_ERRORS';
export const UPDATE_CHART = 'UPDATE_CHART';
export const UPDATE_CHART_CONFIG = 'UPDATE_CHART_CONFIG';
export const UPDATE_DASHBOARD = 'UPDATE_DASHBOARD';
export const UPDATE_FILTER = 'UPDATE_FILTER';
export const UPDATE_RELATIONS = 'UPDATE_RELATIONS';
export const CLEAR_DASHBOARD = 'CLEAR_DASHBOARD';

export const getDashboard = async dashboardID => {
  try {
    const response = await axios.get('/api/v1/dashboard/info', { params: { dashboardID } });
    return { type: GET_DASHBOARD, payload: response.data };
  } catch (error) {
    throw { type: SET_DASHBOARD_ERRORS, payload: error.response };
  }
};

export const updateDashboard = async (clusterID, dashboardID, name) => {
  try {
    const response = await axios.put('/api/v1/dashboard/', { clusterID, dashboardID, name });
    return { type: UPDATE_DASHBOARD, payload: response.data };
  } catch (error) {
    throw { type: SET_DASHBOARD_ERRORS, payload: error.response };
  }
};

export const clearDashboard = () => {
  return { type: CLEAR_DASHBOARD, payload: {} };
};

export const createChart = async (chart, dashboardID, sourceID) => {
  try {
    const response = await axios.post('/api/v1/chart/', { chart, dashboardID, sourceID });
    return { type: CREATE_CHART, payload: response.data };
  } catch (error) {
    throw { type: SET_DASHBOARD_ERRORS, payload: error.response };
  }
};

export const updateChart = async (chart, dashboardID) => {
  try {
    const response = await axios.put('/api/v1/chart/', { chart, dashboardID });
    return { type: UPDATE_CHART, payload: response.data };
  } catch (error) {
    throw { type: SET_DASHBOARD_ERRORS, payload: error.response };
  }
};

export const deleteChart = async (chartID, dashboardID) => {
  try {
    const response = await axios.delete('/api/v1/chart/', { params: { chartID, dashboardID } });
    return { type: DELETE_CHART, payload: response.data };
  } catch (error) {
    throw { type: SET_DASHBOARD_ERRORS, payload: error.response };
  }
};

export const createFilter = async (filterObj, clusterID, dashboardID, sourceID) => {
  try {
    const response = await axios.post('/api/v1/dashboard_filter/', {
      filterObj,
      clusterID,
      dashboardID,
      sourceID,
    });
    return { type: CREATE_FILTER, payload: response.data };
  } catch (error) {
    throw { type: SET_DASHBOARD_ERRORS, payload: error.response };
  }
};

export const updateExistingFilter = async (dashboardID, filterObj, sourceID) => {
  try {
    const response = await axios.put('/api/v1/dashboard_filter/', { dashboardID, filterObj, sourceID });
    return { type: UPDATE_FILTER, payload: response.data };
  } catch (error) {
    throw { type: SET_DASHBOARD_ERRORS, payload: error.response };
  }
};

export const updateAlteredFilters = async (dashboardID, filtersArr) => {
  try {
    const response = await axios.put('/api/v1/dashboard_filter/filters', {
      dashboardID,
      filtersArr: JSON.stringify(filtersArr),
    });
    return { type: UPDATE_FILTER, payload: response.data };
  } catch (error) {
    throw { type: SET_DASHBOARD_ERRORS, payload: error.response };
  }
};

export const createRelations = async (dashboardID, relationsArr) => {
  try {
    return await axios.post('/api/v1/dashboard_relation/', { dashboardID, relationsArr });
  } catch (error) {
    throw { type: SET_DASHBOARD_ERRORS, payload: error.response };
  }
};

export const updateExistingRelations = async (dashboardID, relationsArr) => {
  try {
    return await axios.put('/api/v1/dashboard_relation/', { dashboardID, relationsArr });
  } catch (error) {
    throw { type: SET_DASHBOARD_ERRORS, payload: error.response };
  }
};

export const updateFilterValue = async (valueObj, dashboardID) => {
  try {
    const response = await axios.put('/api/v1/dashboard_filter/value', { dashboardID, valueObj });
    return { type: UPDATE_FILTER, payload: response.data };
  } catch (error) {
    throw { type: SET_DASHBOARD_ERRORS, payload: error.response };
  }
};

export const deleteExistingFilter = async (dashboardID, filterID) => {
  try {
    const response = await axios.delete('/api/v1/dashboard_filter/', { params: { dashboardID, filterID } });
    return { type: DELETE_FILTER, payload: response.data };
  } catch (error) {
    throw { type: SET_DASHBOARD_ERRORS, payload: error.response };
  }
};

export const deleteEmptyFilters = async (dashboardID, filtersArr) => {
  try {
    const response = await axios.delete('/api/v1/dashboard_filter/filters', {
      params: { dashboardID, filtersArr: JSON.stringify(filtersArr) },
    });
    return { type: DELETE_FILTER, payload: response.data };
  } catch (error) {
    throw { type: SET_DASHBOARD_ERRORS, payload: error.response };
  }
};

export const deleteExistingRelations = async (dashboardID, relationsArr) => {
  try {
    const response = await axios.delete('/api/v1/dashboard_relation/', {
      params: { dashboardID, relationsArr },
    });
    return { type: UPDATE_RELATIONS, payload: response.data };
  } catch (error) {
    throw { type: SET_DASHBOARD_ERRORS, payload: error.response };
  }
};

export const updateChartConfigObject = newChart => {
  return {
    type: UPDATE_CHART_CONFIG,
    payload: newChart,
  };
};
/* eslint-enable no-throw-literal */
