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

const addQuery = async (dashboardID, query) => {
  let response;

  try {
    response = await axios.post('/api/query/create', { dashboardID, query });
  } catch (err) {
    console.error(err);
    return;
  }

  const { id: queryID, name: queryName } = response.data;

  return { queryID, queryName };
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
  const { target, hpccID, name } = localState.selectedQuery;

  return { hpccID, name, target };
};

const getUniqueQueries = charts => {
  // Get unique query values
  const uniqueQueries = Array.from(new Set(charts.map(({ queryID }) => queryID))).map(queryID => {
    return charts.find(({ queryID: queryID2 }) => queryID === queryID2);
  });

  return uniqueQueries;
};

export { addQuery, createQueryObj, getQueries, getQueryInfo, getUniqueQueries };
