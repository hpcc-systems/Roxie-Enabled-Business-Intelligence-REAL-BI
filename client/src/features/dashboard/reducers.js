import {
  ADD_DASHBOARD,
  GET_DASHBOARD,
  GET_DASHBOARD_PARAMS,
  GET_DASHBOARDS,
  SET_DASHBOARD_ERRORS,
  UPDATE_DASHBOARD_PARAM,
} from './';
const initState = { dashboards: [], errors: {}, dashboard: {} };

export default (state = initState, { type, payload }) => {
  switch (type) {
    case ADD_DASHBOARD:
      return { ...state, errors: {}, dashboards: payload };
    case GET_DASHBOARD:
      return { ...state, errors: {}, dashboard: payload };
    case GET_DASHBOARD_PARAMS:
      return { ...state, errors: {}, dashboard: { ...state.dashboard, params: payload } };
    case GET_DASHBOARDS:
      return { ...state, errors: {}, dashboards: payload };
    case SET_DASHBOARD_ERRORS:
      return { ...state, errors: payload };
    case UPDATE_DASHBOARD_PARAM:
      return { ...state, errors: {}, dashboard: { ...state.dashboard, params: payload } };
    default:
      return state;
  }
};
