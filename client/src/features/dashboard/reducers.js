import {
  GET_DASHBOARD,
  GET_DASHBOARD_PARAMS,
  SET_DASHBOARD_ERRORS,
  UPDATE_DASHBOARD_PARAM,
} from './';
const initState = { dashboard: {}, errors: {} };

export default (state = initState, { type, payload }) => {
  switch (type) {
    case GET_DASHBOARD:
      return { ...state, errors: {}, dashboard: payload };
    case GET_DASHBOARD_PARAMS:
      return { ...state, errors: {}, dashboard: { ...state.dashboard, params: payload } };
    case SET_DASHBOARD_ERRORS:
      return { ...state, errors: payload };
    case UPDATE_DASHBOARD_PARAM:
      return { ...state, errors: {}, dashboard: { ...state.dashboard, params: payload } };
    default:
      return state;
  }
};
