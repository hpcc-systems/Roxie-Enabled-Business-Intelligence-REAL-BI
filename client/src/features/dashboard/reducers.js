import {
  ADD_CHART,
  ADD_DASHBOARD,
  DELETE_CHART,
  GET_DASHBOARD,
  GET_DASHBOARDS,
  SET_DASHBOARD_ERRORS,
} from './';
const initState = { dashboards: [], errors: {}, dashboard: {} };

export default (state = initState, { type, payload }) => {
  switch (type) {
    case ADD_CHART:
      return {
        ...state,
        errors: {},
        dashboard: { ...state.dashboard, charts: [...state.dashboard.charts, payload] },
      };
    case ADD_DASHBOARD:
      return { ...state, errors: {}, dashboards: payload };
    case DELETE_CHART:
      return {
        ...state,
        errors: {},
        dashboard: { ...state.dashboard, charts: payload },
      };
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
