import { ADD_QUERY, GET_QUERIES, SET_QUERY_ERRORS } from './';
const initState = { queries: [], errors: {} };

export default (state = initState, { type, payload }) => {
  switch (type) {
    case ADD_QUERY:
      return { ...state, errors: {}, queries: [...state.queries, payload] };
    case GET_QUERIES:
      return { ...state, errors: {}, queries: payload };
    case SET_QUERY_ERRORS:
      return { ...state, errors: payload };
    default:
      return state;
  }
};
