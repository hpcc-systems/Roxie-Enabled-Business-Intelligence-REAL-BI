import axios from 'axios';
import { msalInstance } from '../index';
// eslint-disable-next-line no-unused-vars
import { apiScopes, loginScopes } from '../components/AzureLogin/authConfig';

const { REACT_APP_AUTH_METHOD } = process.env;

// TODO: SEND ACCESS TOKEN FOR OUR BACKEND INSTEAD OF ID TOKEN

if (REACT_APP_AUTH_METHOD === 'ADFS') {
  // Add a request interceptor
  axios.interceptors.request.use(
    async req => {
      const account = msalInstance.getActiveAccount();
      if (!account) {
        throw Error(
          'No active account! Verify a user has been signed in and setActiveAccount has been called.',
        );
      }
      try {
        const tokens = await msalInstance.acquireTokenSilent({
          ...loginScopes,
          account: account,
        });
        if (tokens) {
          req.headers.authorization = 'Bearer ' + tokens.idToken;
        }
        return req;
      } catch (error) {
        //If for some reasone we can not get token for request
        //Error will be past to place where HTTP call happened and get into REDUX
        console.log(`interceptor`, error);
        throw error;
      }
    },
    error => {
      Promise.reject(error);
    },
  );
}

const setAuthHeader = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export default setAuthHeader;
