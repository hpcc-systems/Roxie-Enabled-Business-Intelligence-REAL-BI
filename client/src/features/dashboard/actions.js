import axios from 'axios';

// Action Types
export const CREATE_DASHBOARD_PARAM = 'CREATE_DASHBOARD_PARAM';
export const GET_DASHBOARD = 'GET_DASHBOARD';
export const GET_DASHBOARD_PARAMS = 'GET_DASHBOARD_PARAMS';
export const SET_DASHBOARD_ERRORS = 'SET_DASHBOARD_ERRORS';
export const UPDATE_DASHBOARD = 'UPDATE_DASHBOARD';
export const UPDATE_DASHBOARD_PARAM = 'UPDATE_DASHBOARD_PARAM';
export const CLEAR_DASHBOARD = 'CLEAR_DASHBOARD';

export const getDashboard = async dashboardID => {
  let response;

  try {
    response = await axios.get('/api/dashboard/info', { params: { dashboardID } });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  return { type: GET_DASHBOARD, payload: response.data };
};

export const getDashboardParams = async dashboardID => {
  let response;

  try {
    response = await axios.get('/api/dashboardparam/all', { params: { dashboardID } });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  return { type: GET_DASHBOARD_PARAMS, payload: response.data };
};

export const createDashboardParam = async paramObj => {
  let response;

  try {
    response = await axios.post('/api/dashboardparam/create', { paramObj });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  return { type: CREATE_DASHBOARD_PARAM, payload: response.data };
};

export const updateDashboard = async (chartID, dashboardObj) => {
  try {
    await axios.put('/api/dashboard', { chartID, ...dashboardObj });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  return { type: UPDATE_DASHBOARD, payload: dashboardObj };
};

export const updateDashboardParam = async paramObj => {
  let response;

  try {
    response = await axios.put('/api/dashboardparam/update', { paramObj });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  return { type: UPDATE_DASHBOARD_PARAM, payload: response.data };
};

export const deleteDashboardParam = async (dashboardID, filterID) => {
  let response;

  try {
    response = await axios.delete('/api/dashboardparam/delete', { params: { dashboardID, filterID } });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  return { type: UPDATE_DASHBOARD_PARAM, payload: response.data };
};

export const clearDashboard = () => {
  return { type: CLEAR_DASHBOARD, payload: {} };
};
