import { GET_CLUSTERS, SET_CLUSTER_ERRORS } from './actions';
const initState = { clusters: [], errorObj: {} };

export default (state = initState, { type, payload }) => {
  switch (type) {
    case GET_CLUSTERS:
      return { ...state, errorObj: {}, clusters: payload };
    case SET_CLUSTER_ERRORS:
      return { ...state, errorObj: payload };
    default:
      return state;
  }
};
