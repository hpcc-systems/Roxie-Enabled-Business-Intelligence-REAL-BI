const axios = require('axios');
const { findDatasetFields, findQueryDatasets, getFieldType, getParamsString } = require('./misc');

const getQueryListFromCluster = async ({ host, infoPort }, keyword) => {
  let queryList = [];
  let response, url;

  // Build URL from cluster details and keyword provided by user
  url = `${host}:${infoPort}/WsWorkunits/WUListQueries.json?QueryName=*${keyword}*`;

  try {
    response = await axios.get(url);
  } catch (err) {
    throw err;
  }

  const { QuerysetQueries = {} } = response.data.WUListQueriesResponse;

  // Loop through any returned results
  if (Object.keys(QuerysetQueries).length > 0) {
    const queryResults = QuerysetQueries.QuerySetQuery;

    // Filter queries flagged as activated
    queryList = queryResults.filter(({ Activated }) => Activated === true);

    // Remove duplicates from result array
    queryList = Array.from(new Set(queryList.map(({ Id }) => Id))).map(Id => {
      return queryList.find(({ Id: Id2 }) => Id2 === Id);
    });

    // Reduce objects to only desired keys
    queryList = queryList.map(queryObj => {
      const { Id: id, Name: name, QuerySetId: querySet } = queryObj;
      return { id, name, querySet: `${querySet}:${name}` };
    });
  }

  return queryList;
};

const getQueryParamsFromCluster = async ({ host, dataPort }, query) => {
  const [querySet, queryName] = query.split(':');
  let response, data;
  let paramList = [];

  // Build URL from cluster and query details
  const url = `${host}:${dataPort}/WsEcl/example/request/query/${querySet}/${queryName}/json?display`;

  try {
    response = await axios.get(url);
  } catch (err) {
    throw err;
  }

  // Determine if query info was returned within response
  data = response.data[queryName] != undefined ? response.data[queryName] : {};

  // Format parameters for query into array of objects
  paramList = Object.keys(data).map(key => {
    const value = data[key];

    return {
      name: key,
      type: getFieldType(value),
    };
  });

  return paramList;
};

const getQueryDatasetsFromCluster = async ({ host, dataPort }, query) => {
  const [querySet, queryName] = query.split(':');
  let response;
  let data = [];

  // Build URL from cluster and query details
  const url = `${host}:${dataPort}/WsEcl/example/response/query/${querySet}/${queryName}/json?display`;

  try {
    response = await axios.get(url);
  } catch (err) {
    throw err;
  }

  // Find data array from response
  const responseRef = response.data[`${queryName}Response`].Results;
  const datasetRefs = findQueryDatasets(responseRef);

  data = datasetRefs.map(dataset => {
    const fields = findDatasetFields(responseRef[dataset].Row);

    return { name: dataset, fields };
  });

  return data;
};

const getDataFromQuery = async ({ host, dataPort }, { dataset, options, query }) => {
  const [querySet, queryName] = query.split(':');
  const paramsList = getParamsString(options.params);

  const url = `${host}:${dataPort}/WsEcl/submit/query/${querySet}/${queryName}/json${paramsList}`;

  try {
    response = await axios.get(url);
  } catch (err) {
    throw err;
  }

  // Get data array from response
  const responseRef = response.data[`${queryName}Response`].Results;
  data = responseRef[dataset].Row;

  return data;
};

module.exports = {
  getDataFromQuery,
  getQueryDatasetsFromCluster,
  getQueryListFromCluster,
  getQueryParamsFromCluster,
};
