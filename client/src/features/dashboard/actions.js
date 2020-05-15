import axios from 'axios';
import {
  CREATE_DASHBOARD_PARAM,
  GET_DASHBOARD,
  GET_DASHBOARD_PARAMS,
  SET_DASHBOARD_ERRORS,
  UPDATE_DASHBOARD_PARAM,
} from './';

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

const getDashboardParams = async dashboardID => {
  let response;

  try {
    response = await axios.get('/api/dashboardparam/all', { params: { dashboardID } });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  return { type: GET_DASHBOARD_PARAMS, payload: response.data };
};

const createDashboardParam = async paramObj => {
  let response;

  try {
    response = await axios.post('/api/dashboardparam/create', { paramObj });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  return { type: CREATE_DASHBOARD_PARAM, payload: response.data };
};

const updateDashboardParam = async paramObj => {
  let response;

  try {
    response = await axios.put('/api/dashboardparam/update', { paramObj });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  return { type: UPDATE_DASHBOARD_PARAM, payload: response.data };
};

const deleteDashboardParam = async (filtersArr, filterID) => {
  try {
    await axios.delete('/api/dashboardparam/delete', { params: { filterID } });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  // Remove selected filter
  filtersArr = filtersArr.filter(({ id }) => id !== filterID);

  return { type: UPDATE_DASHBOARD_PARAM, payload: filtersArr };
};

export { createDashboardParam, deleteDashboardParam, getDashboard, getDashboardParams, updateDashboardParam };
