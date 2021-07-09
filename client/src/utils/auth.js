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
  try {
    const response = await axios.post('/api/v1/user/update_password', { ...stateObj });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const registerUser = async (stateObj, shareID) => {
  try {
    const response = await axios.post('/api/v1/auth/register', { ...stateObj, shareID });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const forgotPassword = async stateObj => {
  try {
    const response = await axios.post('/api/v1/auth/forgot_password', { ...stateObj });

    // Get UUID from reset url
    const url = response.data.resetUrl;
    const uuidIndex = url.lastIndexOf('/') + 1;
    const uuid = url.substring(uuidIndex, url.length);

    return uuid;
  } catch (error) {
    throw error.response.data;
  }
};

export const resetPassword = async stateObj => {
  try {
    await axios.post('/api/v1/auth/reset_password', { ...stateObj });
  } catch (error) {
    throw error.response.data;
  }

  return;
};

export const callApiWithToken = async (accessToken, apiEndpoint) => {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers,
  };

  return fetch(apiEndpoint, options)
    .then(response => response.json())
    .catch(error => console.log(error));
};
