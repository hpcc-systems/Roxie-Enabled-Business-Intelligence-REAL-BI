import axios from 'axios';

//.env prop
const { REACT_APP_PROXY_URL } = process.env;

// Action Types
export const GET_CLUSTERS = 'GET_CLUSTERS';
export const SET_CLUSTER_ERRORS = 'SET_CLUSTER_ERRORS';

export const getClusters = async () => {
  let response;

  try {
    response = await axios.get(`${REACT_APP_PROXY_URL}/api/cluster/all`);
  } catch (err) {
    console.error(err);
    return { type: SET_CLUSTER_ERRORS, payload: err };
  }

  return { type: GET_CLUSTERS, payload: response.data };
};
