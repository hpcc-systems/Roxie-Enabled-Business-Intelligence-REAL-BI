import axios from 'axios';

export const checkForClusterAuth = async clusterID => {
  let response, authObj;

  try {
    response = await axios.get('/api/clusterauth/check', { params: { clusterID } });
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
    axios.post('/api/clusterauth/create', { ...authObj });
  } catch (err) {
    return console.error(err);
  }

  return;
};
