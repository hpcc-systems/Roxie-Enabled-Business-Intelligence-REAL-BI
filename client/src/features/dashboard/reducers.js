import {
  CREATE_CHART,
  CREATE_FILTER,
  DELETE_CHART,
  DELETE_FILTER,
  GET_DASHBOARD,
  SET_DASHBOARD_ERRORS,
  CLEAR_DASHBOARD,
  UPDATE_CHART,
  UPDATE_DASHBOARD,
  UPDATE_FILTER,
  UPDATE_RELATIONS,
} from './actions';
const initState = { dashboard: {}, errorObj: {} };

export default (state = initState, { type, payload }) => {
  switch (type) {
    case GET_DASHBOARD:
    case UPDATE_DASHBOARD:
    case CLEAR_DASHBOARD:
      return { ...state, errorObj: {}, dashboard: payload };
    case SET_DASHBOARD_ERRORS:
      return { ...state, errorObj: payload };
    case CREATE_CHART:
      return {
        ...state,
        errorObj: {},
        dashboard: {
          ...state.dashboard,
          charts: [...state.dashboard.charts, payload],
        },
      };
    case UPDATE_CHART:
    case DELETE_CHART:
      return {
        ...state,
        errorObj: {},
        dashboard: { ...state.dashboard, charts: payload },
      };
    case CREATE_FILTER:
      return {
        ...state,
        errorObj: {},
        dashboard: { ...state.dashboard, filters: [...state.dashboard.filters, payload] },
      };
    case UPDATE_FILTER:
    case DELETE_FILTER:
      return {
        ...state,
        errorObj: {},
        dashboard: { ...state.dashboard, filters: payload },
      };
    case UPDATE_RELATIONS:
      return {
        ...state,
        errorObj: {},
        dashboard: { ...state.dashboard, relations: payload },
      };
    default:
      return state;
  }
};
