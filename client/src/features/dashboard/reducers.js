import { GET_DASHBOARD, SET_DASHBOARD_ERRORS, CLEAR_DASHBOARD, UPDATE_DASHBOARD } from './actions';
const initState = { dashboard: {}, errors: {} };

export default (state = initState, { type, payload }) => {
  switch (type) {
    case GET_DASHBOARD:
    case UPDATE_DASHBOARD:
    case CLEAR_DASHBOARD:
      return { ...state, errors: {}, dashboard: payload };
    case SET_DASHBOARD_ERRORS:
      return { ...state, errors: payload };
    default:
      return state;
  }
};
