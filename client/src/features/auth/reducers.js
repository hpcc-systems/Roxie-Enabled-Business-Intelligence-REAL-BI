import { SET_AUTH_ERRORS, SET_AUTH_USER, SET_DIRECTORY_DEPTH, SET_LAST_WORKSPACE } from './actions';

const initState = { errorObj: {}, user: {} };

export default (state = initState, { type, payload }) => {
  switch (type) {
    case SET_AUTH_ERRORS:
      return { ...state, errorObj: payload };
    case SET_AUTH_USER:
      return { ...state, errorObj: {}, user: payload };
    case SET_DIRECTORY_DEPTH:
      return { ...state, errorObj: {}, user: { ...state.user, directoryDepth: payload } };
    case SET_LAST_WORKSPACE:
      return { ...state, errorObj: {}, user: { ...state.user, lastViewedWorkspace: payload } };
    default:
      return state;
  }
};
