import axios from 'axios';

//.env prop
const { REACT_APP_PROXY_URL } = process.env;

// Action Types
export const CREATE_DASHBOARD_PARAM = 'CREATE_DASHBOARD_PARAM';
export const GET_DASHBOARD = 'GET_DASHBOARD';
export const GET_DASHBOARD_PARAMS = 'GET_DASHBOARD_PARAMS';
export const SET_DASHBOARD_ERRORS = 'SET_DASHBOARD_ERRORS';
export const UPDATE_DASHBOARD_PARAM = 'UPDATE_DASHBOARD_PARAM';

export const getDashboard = async dashboardID => {
  let response;

  try {
    response = await axios.get(`${REACT_APP_PROXY_URL}/api/dashboard/info`, { params: { dashboardID } });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  return { type: GET_DASHBOARD, payload: response.data };
};

export const getDashboardParams = async dashboardID => {
  let response;

  try {
    response = await axios.get(`${REACT_APP_PROXY_URL}/api/dashboardparam/all`, { params: { dashboardID } });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  return { type: GET_DASHBOARD_PARAMS, payload: response.data };
};

export const createDashboardParam = async paramObj => {
  let response;

  try {
    response = await axios.post(`${REACT_APP_PROXY_URL}/api/dashboardparam/create`, { paramObj });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  return { type: CREATE_DASHBOARD_PARAM, payload: response.data };
};

export const updateDashboardParam = async paramObj => {
  let response;

  try {
    response = await axios.put(`${REACT_APP_PROXY_URL}/api/dashboardparam/update`, { paramObj });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  return { type: UPDATE_DASHBOARD_PARAM, payload: response.data };
};

export const deleteDashboardParam = async (dashboardID, filterID) => {
  let response;

  try {
    response = await axios.delete(`${REACT_APP_PROXY_URL}/api/dashboardparam/delete`, {
      params: { dashboardID, filterID },
    });
  } catch (err) {
    console.error(err);
    return { type: SET_DASHBOARD_ERRORS, payload: err };
  }

  return { type: UPDATE_DASHBOARD_PARAM, payload: response.data };
};
