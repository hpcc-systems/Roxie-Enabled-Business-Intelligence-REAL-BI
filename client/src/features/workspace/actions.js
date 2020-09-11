import axios from 'axios';

// Action Types
export const GET_WORKSPACE = 'GET_WORKSPACE';
export const SET_WORKSPACE_ERROR = 'SET_WORKSPACE_ERROR';
export const UPDATE_WORKSPACE = 'UPDATE_WORKSPACE';
export const CLEAR_WORKSPACE = 'CLEAR_WORKSPACE';
export const UPDATE_WORKSPACE_DASHBOARDS = 'UPDATE_WORKSPACE_DASHBOARDS';
export const UPDATE_WORKSPACE_DIRECTORY = 'UPDATE_WORKSPACE_DIRECTORY';

export const getWorkspace = async workspaceID => {
  let response;

  try {
    response = await axios.get('/api/workspace/find', { params: { workspaceID } });
  } catch (err) {
    return { type: SET_WORKSPACE_ERROR, payload: { msg: err.response.data } };
  }

  return { type: GET_WORKSPACE, payload: response.data };
};

export const updateWorkspaceDirectory = async (directory, directoryDepth, workspaceID) => {
  try {
    await axios.put('/api/workspace/directory', { directory, directoryDepth, workspaceID });
  } catch (err) {
    return { type: SET_WORKSPACE_ERROR, payload: { msg: err.response.data } };
  }

  return { type: UPDATE_WORKSPACE_DIRECTORY, payload: { directory, directoryDepth } };
};

export const clearWorkspaceRef = () => {
  return { type: CLEAR_WORKSPACE, payload: {} };
};

export const openDashboardInWorkspace = async (dashboardObj, workspaceID) => {
  let response;

  try {
    response = await axios.post('/api/workspace/dashboard', { dashboardObj, workspaceID });
  } catch (err) {
    return { type: SET_WORKSPACE_ERROR, payload: { msg: err.response.data } };
  }

  return { type: UPDATE_WORKSPACE_DASHBOARDS, payload: response.data };
};

export const closeDashboardInWorkspace = async (dashboardID, workspaceID) => {
  let response;

  try {
    response = await axios.put('/api/workspace/dashboard', { dashboardID, workspaceID });
  } catch (err) {
    return { type: SET_WORKSPACE_ERROR, payload: { msg: err.response.data } };
  }

  return { type: UPDATE_WORKSPACE_DASHBOARDS, payload: response.data };
};

export const closeMultipleOpenDashboards = async (dashboardIDArray, workspaceID) => {
  let response;

  try {
    response = await axios.put('/api/workspace/dashboard/multiple', { dashboardIDArray, workspaceID });
  } catch (err) {
    return { type: SET_WORKSPACE_ERROR, payload: { msg: err.response.data } };
  }

  return { type: UPDATE_WORKSPACE_DASHBOARDS, payload: response.data };
};
