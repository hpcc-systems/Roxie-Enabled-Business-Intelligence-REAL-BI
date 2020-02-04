import { SET_AUTH_ERRORS, SET_AUTH_USER } from './';
const initState = { errors: {}, userID: null };

export default (state = initState, { type, payload }) => {
  switch (type) {
    case SET_AUTH_ERRORS:
      return { ...state, errors: payload };
    case SET_AUTH_USER:
      return { ...state, errors: {}, userID: payload };
    default:
      return state;
  }
};
