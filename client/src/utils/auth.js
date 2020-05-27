import jwtDecode from 'jwt-decode';

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
