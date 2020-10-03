import jwtDecode from 'jwt-decode';
import axios from 'axios';

// Constants
import { tokenName } from '../constants';

export const isTokenValid = token => {
  // No token provided
  if (!token) return false;

  // Decode token and get expiration
  const { exp } = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  // Token is expired
  if (exp && exp < currentTime) return false;

  // Token is not expired or no expiration value is set (unexpiring token)
  return true;
};

export const checkForToken = () => {
  const token = localStorage.getItem(tokenName);
  const valid = isTokenValid(token);

  return { token, valid };
};

export const updatePassword = async stateObj => {
  let response;

  try {
    response = await axios.post('/api/user/changepwd', { ...stateObj });
  } catch (err) {
    const errReason = err.response.data.reason;

    if (errReason) {
      throw errReason;
    }

    throw err.response.data;
  }

  return response.data;
};

export const registerUser = async stateObj => {
  let response;

  try {
    response = await axios.post('/api/auth/register', { ...stateObj });
  } catch (err) {
    const { data } = err.response;
    let error;

    if (!data.errors) {
      if (typeof data === 'object') {
        error = [{ msg: JSON.stringify(data) }];
        throw error;
      }

      error = [{ msg: data }];
      throw error;
    }

    throw data.errors;
  }

  return response.status;
};

export const forgotPassword = async stateObj => {
  let response;

  try {
    response = await axios.post('/api/auth/forgot-password', { ...stateObj });
  } catch (err) {
    const { data } = err.response;
    let error;

    if (!data.errors) {
      if (typeof data === 'object') {
        error = [{ msg: JSON.stringify(data) }];
        throw error;
      }

      error = [{ msg: data }];
      throw error;
    }

    throw data.errors;
  }

  // Get UUID from reset url
  const url = response.data.resetUrl;
  const uuidIndex = url.lastIndexOf('/') + 1;
  const uuid = url.substring(uuidIndex, url.length);

  return uuid;
};

export const resetPassword = async stateObj => {
  try {
    await axios.post('/api/auth/reset-password', { ...stateObj });
  } catch (err) {
    const { data } = err.response;
    let error;

    if (!data.errors) {
      if (typeof data === 'object') {
        error = [{ msg: JSON.stringify(data) }];
        throw error;
      }

      error = [{ msg: data }];
      throw error;
    }

    throw data.errors;
  }

  return;
};
