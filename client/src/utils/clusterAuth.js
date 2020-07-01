import axios from 'axios';

//.env prop
const { REACT_APP_PROXY_URL } = process.env;

export const checkForClusterAuth = async clusterID => {
  let response, authObj;

  try {
    response = await axios.get(`${REACT_APP_PROXY_URL}/api/clusterauth/check`, { params: { clusterID } });
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
    axios.post(`${REACT_APP_PROXY_URL}/api/clusterauth/create`, { ...authObj });
  } catch (err) {
    return console.error(err);
  }

  return;
};
