import axios from 'axios';

//Constants
import { initUserObj } from '../../constants';

// Action Types
export const SET_AUTH_ERRORS = 'SET_AUTH_ERRORS';
export const SET_AUTH_USER = 'SET_AUTH_USER';
export const SET_DIRECTORY_DEPTH = 'SET_DIRECTORY_DEPTH';
export const SET_LAST_WORKSPACE = 'SET_LAST_WORKSPACE';
export const GET_WORKSPACES = 'GET_WORKSPACES';

export const loginUser = async ({ username, password }) => {
  let response;

  try {
    response = await axios.post('/api/auth/login', { username, password });
  } catch (err) {
    return { action: { type: SET_AUTH_ERRORS, payload: { msg: err.response.data } } };
  }

  // Destructure response
  const { token, ...user } = response.data;

  return { action: { type: SET_AUTH_USER, payload: user }, lastWorkspace: user.lastWorkspace, token };
};

export const getLatestUserData = async () => {
  let response;

  try {
    response = await axios.get('/api/user/getdata');
  } catch (err) {
    console.error(err);
    return { type: SET_AUTH_ERRORS, payload: err };
  }

  // Get last dashboard id from response
  const { lastWorkspace } = response.data;

  return { action: { type: SET_AUTH_USER, payload: response.data }, lastWorkspace };
};

export const createNewWorkspace = async localState => {
  let response;

  try {
    response = await axios.post('/api/workspace/', { ...localState });
  } catch (err) {
    console.error(err);
    return { type: SET_AUTH_ERRORS, payload: err };
  }

  return { type: GET_WORKSPACES, payload: response.data };
};

export const updateLastWorkspace = async workspaceID => {
  try {
    await axios.put('/api/workspace/last', { workspaceID });
  } catch (err) {
    console.error(err);
    return { type: SET_AUTH_ERRORS, payload: err };
  }

  return { type: SET_LAST_WORKSPACE, payload: workspaceID };
};

export const logoutUser = () => {
  return { type: SET_AUTH_USER, payload: initUserObj };
};
