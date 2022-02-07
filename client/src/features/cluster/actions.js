/* eslint-disable no-unreachable */
import axios from 'axios';

// Action Types
export const FETCH_CLUSTERS = 'FETCH_CLUSTERS';
export const SET_CLUSTERS = 'SET_CLUSTERS';
export const SET_CLUSTERS_ERROR = 'SET_CLUSTERS_ERROR';

export const getClusters = () => {
  return async dispatch => {
    try {
      dispatch({ type: FETCH_CLUSTERS });
      const response = await axios.get('/api/v1/cluster/all');
      dispatch({ type: SET_CLUSTERS, payload: response.data });
    } catch (error) {
      console.log('-error getClusters-----------------------------------------');
      console.dir({ error }, { depth: null });
      console.log('------------------------------------------');
      dispatch({ type: SET_CLUSTERS_ERROR, payload: 'Failed to get clusters list' });
    }
  };
};
