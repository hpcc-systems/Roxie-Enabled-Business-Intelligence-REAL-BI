import axios from 'axios';

// Action Types
export const GET_CLUSTERS = 'GET_CLUSTERS';
export const SET_CLUSTER_ERRORS = 'SET_CLUSTER_ERRORS';

export const getClusters = async () => {
  let response;

  try {
    response = await axios.get('/api/v1/cluster/all');
  } catch (err) {
    console.error(err);
    return { type: SET_CLUSTER_ERRORS, payload: err };
  }

  return { type: GET_CLUSTERS, payload: response.data };
};
