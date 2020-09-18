import axios from 'axios';

// Action Types
export const GET_DASHBOARD = 'GET_DASHBOARD';
export const SET_DASHBOARD_ERRORS = 'SET_DASHBOARD_ERRORS';
export const UPDATE_DASHBOARD = 'UPDATE_DASHBOARD';
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

export const updateDashboard = async dashboardObj => {
  try {
    await axios.put('/api/dashboard', { ...dashboardObj });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  return { type: UPDATE_DASHBOARD, payload: dashboardObj };
};

export const clearDashboard = () => {
  return { type: CLEAR_DASHBOARD, payload: {} };
};
