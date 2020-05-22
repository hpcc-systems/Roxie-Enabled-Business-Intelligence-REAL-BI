import { SET_AUTH_ERRORS, SET_AUTH_USER, SET_DIRECTORY_DEPTH, SET_LAST_DASHBOARD } from './actions';

// Constants
import { initUserObj } from '../../constants';

const initState = { errors: {}, user: initUserObj };

export default (state = initState, { type, payload }) => {
  switch (type) {
    case SET_AUTH_ERRORS:
      return { ...state, errors: payload };
    case SET_AUTH_USER:
      return { ...state, errors: {}, user: payload };
    case SET_DIRECTORY_DEPTH:
      return { ...state, errors: {}, user: { ...state.user, directoryDepth: payload } };
    case SET_LAST_DASHBOARD:
      return { ...state, errors: {}, user: { ...state.user, lastDashboard: payload } };
    default:
      return state;
  }
};
