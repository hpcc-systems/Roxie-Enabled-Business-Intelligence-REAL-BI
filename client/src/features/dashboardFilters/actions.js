import { getFilterData } from '../../utils/dashboardFilter';

export const FETCH_SOURCE_DATA = 'FETCH_SOURCE_DATA';
export const FETCH_SOURCE_DATA_SUCCESS = 'FETCH_SOURCE_DATA_SUCCESS';
export const FETCH_SOURCE_DATA_FAILURE = 'FETCH_SOURCE_DATA_FAILURE';

export const getSourceData = ({ clusterID, filterID, hpccID, accessOnBehalf }) => {
  return async dispatch => {
    try {
      dispatch(fetchSourceData({ hpccID }));
      const result = await getFilterData(clusterID, filterID, accessOnBehalf);
      const data = result.data;
      dispatch(fetchSourceDataSuccess({ hpccID, data }));
    } catch (error) {
      dispatch(fetchSourceDataFailure({ hpccID, error: error.message }));
    }
  };
};

export const fetchSourceData = ({ hpccID }) => {
  return {
    type: FETCH_SOURCE_DATA,
    payload: { hpccID },
  };
};

export const fetchSourceDataSuccess = ({ hpccID, data }) => {
  return {
    type: FETCH_SOURCE_DATA_SUCCESS,
    payload: { hpccID, data },
  };
};

export const fetchSourceDataFailure = ({ hpccID, error }) => {
  return {
    type: FETCH_SOURCE_DATA_FAILURE,
    payload: { hpccID, error },
  };
};
