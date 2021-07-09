/* eslint-disable no-throw-literal */
import axios from 'axios';
import { GET_WORKSPACES, SET_WORKSPACE_ERROR } from '../workspace/actions';

// Action Types
export const SET_AUTH_ERRORS = 'SET_AUTH_ERRORS';
export const SET_AUTH_USER = 'SET_AUTH_USER';
export const SET_DIRECTORY_DEPTH = 'SET_DIRECTORY_DEPTH';
export const SET_LAST_WORKSPACE = 'SET_LAST_WORKSPACE';

export const loginUser = async ({ username, password }) => {
  try {
    const response = await axios.post('/api/v1/auth/login', { username, password });
    const { token, ...user } = response.data;

    return {
      action: { type: SET_AUTH_USER, payload: user },
      token,
    };
  } catch (error) {
    throw { type: SET_AUTH_ERRORS, payload: error.response.data };
  }
};

export const getLatestUserData = async () => {
  try {
    const response = await axios.get('/api/v1/user/get_data');
    const { lastViewedWorkspace } = response.data;

    return { action: { type: SET_AUTH_USER, payload: response.data }, lastViewedWorkspace };
  } catch (err) {
    throw { type: SET_AUTH_ERRORS, payload: err.response };
  }
};

export const updateLastWorkspace = async workspaceID => {
  try {
    await axios.put('/api/v1/workspace/last', { workspaceID });
    return { type: SET_LAST_WORKSPACE, payload: workspaceID };
  } catch (error) {
    throw { type: SET_AUTH_ERRORS, payload: error.response.data };
  }
};

export const logoutUser = () => {
  return { type: SET_AUTH_USER, payload: {} };
};

export const getUserStateWithAzure = user => async dispatch => {
  // 1.Get user from DB or Create a User
  try {
    const { data: userFromDB } = await axios.post('/api/v1/azure/loginAzure', user);
    dispatch({ type: SET_AUTH_USER, payload: userFromDB });
  } catch (error) {
    dispatch({ type: SET_AUTH_ERRORS, payload: error.message });
    return;
  }
  // 2. Get Workspaces
  try {
    const response = await axios.get('/api/v1/workspace/all');
    dispatch({ type: GET_WORKSPACES, payload: response.data });
  } catch (error) {
    dispatch({ type: SET_WORKSPACE_ERROR, payload: error.message });
    return;
  }
};
/* eslint-enable no-throw-literal */
