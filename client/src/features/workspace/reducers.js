import {
  GET_WORKSPACE,
  GET_WORKSPACES,
  SET_WORKSPACE_ERROR,
  CLEAR_WORKSPACE,
  UPDATE_WORKSPACE_DASHBOARDS,
  UPDATE_WORKSPACE_DIRECTORY,
} from './actions';

const initState = { errors: {}, workspace: {}, workspaces: [] };

export default (state = initState, { type, payload }) => {
  switch (type) {
    case GET_WORKSPACES:
      return { ...state, errors: {}, workspaces: payload };
    case GET_WORKSPACE:
    case CLEAR_WORKSPACE:
      return { ...state, errors: {}, workspace: payload };
    case SET_WORKSPACE_ERROR:
      return { ...state, errors: payload };
    case UPDATE_WORKSPACE_DASHBOARDS:
      return { ...state, errors: {}, workspace: { ...state.workspace, openDashboards: payload } };
    case UPDATE_WORKSPACE_DIRECTORY:
      return {
        ...state,
        errors: {},
        workspace: {
          ...state.workspace,
          directory: payload.directory,
          directoryDepth: payload.directoryDepth,
        },
      };
    default:
      return state;
  }
};
