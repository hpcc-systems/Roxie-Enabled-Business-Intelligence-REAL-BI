/* eslint-disable no-throw-literal */
import axios from 'axios';
import { SET_LAST_WORKSPACE } from '../auth/actions';

// Action Types
export const GET_WORKSPACES = 'GET_WORKSPACES';
export const GET_WORKSPACE = 'GET_WORKSPACE';
export const SET_WORKSPACE_ERROR = 'SET_WORKSPACE_ERROR';
export const CLEAR_WORKSPACE = 'CLEAR_WORKSPACE';
export const UPDATE_WORKSPACE_DASHBOARDS = 'UPDATE_WORKSPACE_DASHBOARDS';
export const UPDATE_WORKSPACE_DIRECTORY = 'UPDATE_WORKSPACE_DIRECTORY';
export const SET_WORKSPACE_ERROR_EMPTY = 'SET_WORKSPACE_ERROR_EMPTY';

export const resetWorkspaceError = () => ({ type: 'SET_WORKSPACE_ERROR_EMPTY' });

export const getWorkspaces = async () => {
  try {
    const response = await axios.get('/api/v1/workspace/all');
    return { type: GET_WORKSPACES, payload: response.data };
  } catch (error) {
    throw { type: SET_WORKSPACE_ERROR, payload: error.response.data };
  }
};

export const getWorkspace = async (workspaceID, dashID) => {
  try {
    const response = await axios.get('/api/v1/workspace/find', { params: { workspaceID, dashID } });
    return [
      { type: GET_WORKSPACE, payload: response.data.workspace }, //big object with all assets for workspace and dashboards
      { type: GET_WORKSPACES, payload: response.data.workspaces }, //populate dropdown
      { type: SET_LAST_WORKSPACE, payload: response.data.workspace.id },
    ];
  } catch (error) {
    throw { type: SET_WORKSPACE_ERROR, payload: error.response.data };
  }
};

export const createNewWorkspace = async localState => {
  try {
    const response = await axios.post('/api/v1/workspace/', { ...localState });
    const { workspaces, workspaceID } = response.data;

    return { action: { type: GET_WORKSPACES, payload: workspaces }, workspaceID };
  } catch (error) {
    throw { type: SET_WORKSPACE_ERROR, payload: error.response.data };
  }
};

export const updateWorkspace = async (options, workspaceID) => {
  try {
    const response = await axios.put('/api/v1/workspace/', { ...options, workspaceID });

    const actions = [
      { type: GET_WORKSPACES, payload: response.data.workspaces },
      { type: GET_WORKSPACE, payload: response.data.currentWorkspace },
    ];

    return actions;
  } catch (error) {
    throw { type: SET_WORKSPACE_ERROR, payload: error.response.data };
  }
};

export const deleteWorkspace = async workspaceID => {
  try {
    const response = await axios.delete('/api/v1/workspace/', { params: { workspaceID } });

    const actions = [
      { type: GET_WORKSPACES, payload: response.data },
      { type: CLEAR_WORKSPACE, payload: {} },
    ];

    return actions;
  } catch (error) {
    throw { type: SET_WORKSPACE_ERROR, payload: error.response.data };
  }
};

export const updateWorkspaceDirectory = async (directory, workspaceID) => {
  try {
    const response = await axios.put('/api/v1/workspace_directory/', { directory, workspaceID });
    return { type: UPDATE_WORKSPACE_DIRECTORY, payload: response.data.directory };
  } catch (error) {
    throw { type: SET_WORKSPACE_ERROR, payload: error.response.data };
  }
};

export const clearWorkspaceRef = () => {
  return { type: CLEAR_WORKSPACE, payload: {} };
};

export const getOpenDashboardsInWorkspace = async workspaceID => {
  try {
    const response = await axios.get('/api/v1/workspace/open_dashboard', { params: { workspaceID } });
    return { type: UPDATE_WORKSPACE_DASHBOARDS, payload: response.data };
  } catch (error) {
    throw { type: SET_WORKSPACE_ERROR, payload: error.response.data };
  }
};

export const openDashboardInWorkspace = async (dashboardID, workspaceID) => {
  try {
    const response = await axios.post('/api/v1/workspace/open_dashboard', { dashboardID, workspaceID });
    return { type: UPDATE_WORKSPACE_DASHBOARDS, payload: response.data };
  } catch (error) {
    throw { type: SET_WORKSPACE_ERROR, payload: error.response.data };
  }
};

export const closeDashboardInWorkspace = async (dashboardID, workspaceID) => {
  try {
    const response = await axios.delete('/api/v1/workspace/open_dashboard', {
      params: { dashboardID, workspaceID },
    });
    return { type: UPDATE_WORKSPACE_DASHBOARDS, payload: response.data };
  } catch (error) {
    throw { type: SET_WORKSPACE_ERROR, payload: error.response.data };
  }
};

export const closeMultipleOpenDashboards = async (dashboardIDArray, workspaceID) => {
  try {
    const response = await axios.delete('/api/v1/workspace/open_dashboard/multiple', {
      params: {
        dashboardIDArray,
        workspaceID,
      },
    });
    return { type: UPDATE_WORKSPACE_DASHBOARDS, payload: response.data };
  } catch (error) {
    throw { type: SET_WORKSPACE_ERROR, payload: error.response.data };
  }
};
/* eslint-enable no-throw-literal */
