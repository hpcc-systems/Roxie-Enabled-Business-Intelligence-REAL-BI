import axios from 'axios';
import { GET_QUERIES, GET_QUERY_INFO, SET_QUERY_ERRORS } from './';

const getQueries = async (clusterID, keyword) => {
  let response;

  try {
    response = await axios.get('/api/query/search', { params: { clusterID, keyword } });
  } catch (err) {
    console.error(err);
    return { type: SET_QUERY_ERRORS, payload: err };
  }

  return { type: GET_QUERIES, payload: response.data };
};

const getQueryInfo = async (clusterID, query) => {
  let response;

  try {
    response = await axios.get('/api/query/info', { params: { clusterID, query } });
  } catch (err) {
    console.error(err);
    return { type: SET_QUERY_ERRORS, payload: err };
  }

  return { type: GET_QUERY_INFO, payload: response.data };
};

export { getQueries, getQueryInfo };
