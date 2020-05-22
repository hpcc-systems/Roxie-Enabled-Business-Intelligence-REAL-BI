import { GET_CLUSTERS, SET_CLUSTER_ERRORS } from './actions';
const initState = { clusters: [], errors: {} };

export default (state = initState, { type, payload }) => {
  switch (type) {
    case GET_CLUSTERS:
      return { ...state, errors: {}, clusters: payload };
    case SET_CLUSTER_ERRORS:
      return { ...state, errors: payload };
    default:
      return state;
  }
};
