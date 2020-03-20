import axios from 'axios';

const getQueries = async (clusterID, keyword) => {
  let response;

  try {
    response = await axios.get('/api/query/search', { params: { clusterID, keyword } });
  } catch (err) {
    console.error(err);
    return;
  }

  return response.data;
};

const getQueryInfo = async (clusterID, query) => {
  let response;

  try {
    response = await axios.get('/api/query/info', { params: { clusterID, query } });
  } catch (err) {
    console.error(err);
    return;
  }

  return response.data;
};

const createQueryObj = localState => {
  const {
    params,
    selectedQuery: { target, hpccID, name },
  } = localState;

  return { hpccID, name, params, target };
};

const getUniqueQueries = charts => {
  // Get unique query values
  const uniqueQueries = Array.from(new Set(charts.map(({ queryID }) => queryID))).map(queryID => {
    return charts.find(({ queryID: queryID2 }) => queryID === queryID2);
  });

  return uniqueQueries;
};

export { createQueryObj, getQueries, getQueryInfo, getUniqueQueries };
