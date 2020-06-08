import jwtDecode from 'jwt-decode';

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