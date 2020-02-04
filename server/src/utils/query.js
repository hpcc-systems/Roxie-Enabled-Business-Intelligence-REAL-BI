const axios = require('axios');
const { getFieldType } = require('./misc');

const getQueryListFromCluster = async ({ host, port }, keyword) => {
  let queryList = [];
  let response, url;

  // Build URL from cluster details and keyword provided by user
  url = `${host}:${port}/WsWorkunits/WUListQueries.json?QueryName=*${keyword}*`;

  try {
    response = await axios.get(url);
  } catch (err) {
    return err;
  }

  const { QuerysetQueries = {} } = response.data.WUListQueriesResponse;

  // Loop through any returned results
  if (Object.keys(QuerysetQueries).length > 0) {
    const queryResults = QuerysetQueries.QuerySetQuery;

    // Remove duplicates from result array
    queryList = Array.from(new Set(queryResults.map(({ Id }) => Id))).map(Id => {
      return queryResults.find(({ Id: Id2 }) => Id2 === Id);
    });

    // Reduce objects to only desired keys
    queryList = queryList.map(queryObj => {
      const { Id: id, Name: name, QuerySetId: querySet } = queryObj;
      return { id, name, querySet: `${querySet}:${name}` };
    });
  }

  return queryList;
};

const getQueryParamsFromCluster = async ({ host }, query) => {
  const [querySet, queryName] = query.split(':');
  let response, data;
  let paramList = [];

  // Build URL from cluster and query details
  const url = `${host}:8002/WsEcl/example/request/query/${querySet}/${queryName}/json?display`;

  try {
    response = await axios.get(url);
  } catch (err) {
    return err;
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

const getQueryFieldsFromCluster = async ({ host }, query) => {
  const [querySet, queryName] = query.split(':');
  let response, data;
  let fieldList = [];

  // Build URL from cluster and query details
  const url = `${host}:8002/WsEcl/example/response/query/${querySet}/${queryName}/json?display`;

  try {
    response = await axios.get(url);
  } catch (err) {
    return err;
  }

  // Determine if query info was returned within response
  data = response.data[`${queryName}Response`].Results['Result 1'].Row;
  data = data != undefined ? data[0] : {};

  // Format fields from query into array of objects
  fieldList = Object.keys(data).map(key => {
    const value = data[key];

    return {
      name: key,
      type: getFieldType(value),
      checked: false, // Used by client
    };
  });

  return fieldList;
};

module.exports = { getQueryFieldsFromCluster, getQueryListFromCluster, getQueryParamsFromCluster };
