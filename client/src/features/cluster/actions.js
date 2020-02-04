import axios from 'axios';
import { GET_CLUSTERS, SET_CLUSTER_ERRORS } from '.';

const getClusters = async () => {
  let response;

  try {
    response = await axios.get('/api/cluster/all');
  } catch (err) {
    console.error(err);
    return { type: SET_CLUSTER_ERRORS, payload: err };
  }

  return { type: GET_CLUSTERS, payload: response.data };
};

export { getClusters };
