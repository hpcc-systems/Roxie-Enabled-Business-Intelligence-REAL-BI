import { ADD_DASHBOARD, GET_DASHBOARD, GET_DASHBOARDS, SET_DASHBOARD_ERRORS } from './';
const initState = { dashboards: [], errors: {}, dashboard: {} };

export default (state = initState, { type, payload }) => {
  switch (type) {
    case ADD_DASHBOARD:
      return { ...state, errors: {}, dashboards: payload };
    case GET_DASHBOARD:
      return { ...state, errors: {}, dashboard: payload };
    case GET_DASHBOARDS:
      return { ...state, errors: {}, dashboards: payload };
    case SET_DASHBOARD_ERRORS:
      return { ...state, errors: payload };
    default:
      return state;
  }
};
