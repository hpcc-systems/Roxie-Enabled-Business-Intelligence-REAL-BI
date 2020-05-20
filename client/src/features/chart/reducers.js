import { ADD_CHART, DELETE_CHART, GET_CHARTS, SET_CHART_ERRORS, UPDATE_CHART } from './actions';
const initState = { charts: [], errors: {} };

export default (state = initState, { type, payload }) => {
  switch (type) {
    case ADD_CHART:
      return {
        ...state,
        errors: {},
        charts: [...state.charts, payload],
      };
    case DELETE_CHART:
      return {
        ...state,
        errors: {},
        charts: payload,
      };
    case GET_CHARTS:
      return { ...state, charts: payload, errors: {} };
    case SET_CHART_ERRORS:
      return { ...state, errors: payload };
    case UPDATE_CHART:
      return { ...state, charts: payload, errors: {} };
    default:
      return state;
  }
};
