import { GET_QUERIES, GET_QUERY_INFO, SET_QUERY_ERRORS } from './';
const initState = { queries: [], errors: {}, query: {} };

export default (state = initState, { type, payload }) => {
  switch (type) {
    case GET_QUERIES:
      return { ...state, errors: {}, queries: payload };
    case GET_QUERY_INFO:
      return { ...state, errors: {}, query: payload };
    case SET_QUERY_ERRORS:
      return { ...state, errors: payload };
    default:
      return state;
  }
};
