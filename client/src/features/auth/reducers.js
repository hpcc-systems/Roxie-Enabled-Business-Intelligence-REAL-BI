import { GET_DIRECTORY_TREE, SET_AUTH_ERRORS, SET_AUTH_USER } from './';
const initState = { errors: {}, user: null };

export default (state = initState, { type, payload }) => {
  switch (type) {
    case GET_DIRECTORY_TREE:
      return { ...state, errors: {}, user: { ...state.user, directory: payload } };
    case SET_AUTH_ERRORS:
      return { ...state, errors: payload };
    case SET_AUTH_USER:
      return { ...state, errors: {}, user: payload };
    default:
      return state;
  }
};
