import { FETCH_SOURCE_DATA, FETCH_SOURCE_DATA_FAILURE, FETCH_SOURCE_DATA_SUCCESS } from './actions';

const initialState = {
  // [hpccID] :{ loading:false, data:[], error:''}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SOURCE_DATA:
      return {
        ...state,
        [action.payload.hpccID]: { loading: true, data: [], error: '' },
      };
    case FETCH_SOURCE_DATA_SUCCESS:
      return {
        ...state,
        [action.payload.hpccID]: { loading: false, data: action.payload.data, error: '' },
      };
    case FETCH_SOURCE_DATA_FAILURE:
      return {
        ...state,
        [action.payload.hpccID]: { loading: false, data: [], error: action.payload.error },
      };
    default:
      return state;
  }
};
