import axios from 'axios';
import { ADD_QUERY, GET_QUERIES, SET_QUERY_ERRORS } from './';

const addQuery = async (dashboardID, query) => {
  let response;

  try {
    response = await axios.post('/api/query/create', { dashboardID, query });
  } catch (err) {
    console.error(err);
    return { type: SET_QUERY_ERRORS, payload: err };
  }

  const { id: queryID, name: queryName } = response.data;

  return {
    action: { type: ADD_QUERY, payload: response.data },
    queryID,
    queryName,
  };
};

const getQueries = async () => {
  let response;

  try {
    response = await axios.get('/api/query/all');
  } catch (err) {
    console.error(err);
    return { type: SET_QUERY_ERRORS, payload: err };
  }

  return { type: GET_QUERIES, payload: response.data };
};

export { addQuery, getQueries };
