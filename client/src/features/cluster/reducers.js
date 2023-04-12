import { FETCH_CLUSTERS, SET_CLUSTERS, SET_CLUSTERS_ERROR } from './actions';

const initState = { clusters: [], error: '', loading: false };

export default (state = initState, { type, payload }) => {
  switch (type) {
    case FETCH_CLUSTERS:
      return { ...state, error: '', loading: true };
    case SET_CLUSTERS:
      return { ...state, clusters: payload, loading: false };
    case SET_CLUSTERS_ERROR:
      return { ...state, error: payload, loading: false };
    default:
      return state;
  }
};
