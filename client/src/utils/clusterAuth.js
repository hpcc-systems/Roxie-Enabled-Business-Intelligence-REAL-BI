import axios from 'axios';

// Constants
const REACT_APP_SERVER_PROXY = process.env.REACT_APP_SERVER_PROXY;

export const checkForClusterAuth = async clusterID => {
  let response, authObj;

  try {
    response = await axios.get(`${REACT_APP_SERVER_PROXY}/api/clusterauth/check`, { params: { clusterID } });
  } catch (err) {
    console.error(err);
    return false;
  }

  // Default to empty object if nothing was returned
  authObj = response.data || {};

  // No auth creds for particular cluster
  if (Object.keys(authObj).length === 0) return false;

  // User has auth creds stored in DB
  return true;
};

export const createClusterAuth = async authObj => {
  try {
    axios.post(`${REACT_APP_SERVER_PROXY}/api/clusterauth/create`, { ...authObj });
  } catch (err) {
    return console.error(err);
  }

  return;
};
