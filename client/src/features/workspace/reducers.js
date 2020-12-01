import {
  GET_WORKSPACE,
  GET_WORKSPACES,
  SET_WORKSPACE_ERROR,
  CLEAR_WORKSPACE,
  UPDATE_WORKSPACE_DASHBOARDS,
  UPDATE_WORKSPACE_DIRECTORY,
} from './actions';

export default (state = {}, { type, payload }) => {
  switch (type) {
    case GET_WORKSPACES:
      return { ...state, errorObj: {}, workspaces: payload };
    case GET_WORKSPACE:
    case CLEAR_WORKSPACE:
      return { ...state, errorObj: {}, workspace: payload };
    case SET_WORKSPACE_ERROR:
      return { ...state, errorObj: payload };
    case UPDATE_WORKSPACE_DASHBOARDS:
      return { ...state, errorObj: {}, workspace: { ...state.workspace, openDashboards: payload } };
    case UPDATE_WORKSPACE_DIRECTORY:
      return {
        ...state,
        errorObj: {},
        workspace: {
          ...state.workspace,
          directory: payload,
        },
      };
    default:
      return state;
  }
};
