import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { SET_AUTH_ERRORS, SET_AUTH_USER } from './';

// Utils
import setAuthHeader from '../../utils/axiosConfig';

const loginUser = async () => {
  let response;

  try {
    response = await axios.post('/api/auth/login', { userID: 1 });
  } catch (err) {
    console.error(err);
    return { type: SET_AUTH_ERRORS, payload: err };
  }

  const { jwt } = response.data;
  localStorage.setItem('hpccDashboardToken', jwt);

  return setUserFromToken(jwt);
};

// Set local storage jwt and return redux action object
const setUserFromToken = token => {
  if (!token) {
    // Remove global axios authorization header
    setAuthHeader();

    // Create object that matches initial state of user object in redux store
    const storeInitUserObj = { id: null, directory: [] };

    return { type: SET_AUTH_USER, payload: storeInitUserObj };
  }

  const user = jwt_decode(token);

  // Set global axios authorization header
  setAuthHeader(token);

  return { type: SET_AUTH_USER, payload: user };
};

export { loginUser, setUserFromToken };
