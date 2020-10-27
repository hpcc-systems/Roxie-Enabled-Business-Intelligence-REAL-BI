import axios from 'axios';

//Constants
import { initUserObj } from '../../constants';

// Action Types
export const SET_AUTH_ERRORS = 'SET_AUTH_ERRORS';
export const SET_AUTH_USER = 'SET_AUTH_USER';
export const SET_DIRECTORY_DEPTH = 'SET_DIRECTORY_DEPTH';
export const SET_LAST_WORKSPACE = 'SET_LAST_WORKSPACE';

export const loginUser = async ({ username, password }) => {
  let response;

  try {
    response = await axios.post('/api/auth/login', { username, password });
  } catch (err) {
    const { errors = [{ msg: 'Server Error' }] } = err.response.data;
    return { action: { type: SET_AUTH_ERRORS, payload: errors } };
  }

  // Destructure response
  const { token, ...user } = response.data;

  return { action: { type: SET_AUTH_USER, payload: user }, lastWorkspace: user.lastWorkspace, token };
};

export const getLatestUserData = async () => {
  let user;

  try {
    user = await axios.get('/api/user/getdata');
  } catch (err) {
    throw { type: SET_AUTH_ERRORS, payload: err.response };
  }

  // Get last dashboard id from response
  const { lastWorkspace } = user.data;

  return { action: { type: SET_AUTH_USER, payload: user.data }, lastWorkspace };
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
