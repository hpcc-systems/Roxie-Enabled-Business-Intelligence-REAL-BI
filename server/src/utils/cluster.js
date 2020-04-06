const axios = require('axios');

// DB Models
const { cluster: clusterModel } = require('../models');

// Utils
const {
  awaitHandler,
  createParamString,
  findQueryDatasets,
  getDatasetFields,
  getType,
  unNestSequelizeObj,
} = require('./misc');

const getClusterByID = async id => {
  let [err, cluster] = await awaitHandler(clusterModel.findOne({ where: { id } }));

  // Return error
  if (err) throw err;

  // Get nested object
  cluster = unNestSequelizeObj(cluster);

  return cluster;
};

const getClusters = async () => {
  let [err, clusters] = await awaitHandler(clusterModel.findAll());

  // Return error
  if (err) throw err;

  return clusters;
};

const getDataFromCluster = async ({ host, dataPort }, { params, query }) => {
  const { name, target } = query;
  const paramsList = createParamString(params);

  // Build URL from cluster and query details
  const url = `${host}:${dataPort}/WsEcl/submit/query/${target}/${name}/json${paramsList}`;

  let [err, response] = await awaitHandler(axios.get(url));

  // Return error
  if (err) throw err;

  // Get data array from response
  let { Results = [] } = response.data[`${name}Response`];

  return Results;
};

const getQueryDatasetsFromCluster = async ({ host, dataPort }, { name, target }) => {
  let datasets;

  // Build URL from cluster and query details
  const url = `${host}:${dataPort}/WsEcl/example/response/query/${target}/${name}/json?display`;

  let [err, response] = await awaitHandler(axios.get(url));

  // Return error
  if (err) throw err;

  // Get reference to nested data object
  const { Results = {} } = response.data[`${name}Response`];

  // Create array of formatted objects
  datasets = findQueryDatasets(Results).map(dataset => {
    const fields = getDatasetFields(Results[dataset].Row);

    return { name: dataset, fields };
  });

  return datasets;
};

const getQueryListFromCluster = async ({ host, infoPort }, keyword) => {
  let queries, url;

  // Build URL from cluster details and keyword provided by user
  url = `${host}:${infoPort}/WsWorkunits/WUListQueries.json?QueryName=*${keyword}*`;

  let [err, response] = await awaitHandler(axios.get(url));

  // Return error
  if (err) throw err;

  // Get nested query object
  const { QuerysetQueries = { QuerySetQuery: [] } } = response.data.WUListQueriesResponse;

  // Filter queries flagged as activated
  queries = QuerysetQueries.QuerySetQuery.filter(({ Activated }) => Activated === true);

  // Remove duplicates from queries array
  queries = Array.from(new Set(queries.map(({ Id }) => Id))).map(Id => {
    return queries.find(({ Id: Id2 }) => Id2 === Id);
  });

  // Reduce objects to only desired keys
  queries = queries.map(({ Id, Name, QuerySetId }) => {
    return { hpccID: Id, name: Name, target: QuerySetId };
  });

  return queries;
};

const getQueryParamsFromCluster = async ({ host, dataPort }, { name, target }) => {
  let params;

  // Build URL from cluster and query details
  const url = `${host}:${dataPort}/WsEcl/example/request/query/${target}/${name}/json?display`;

  let [err, response] = await awaitHandler(axios.get(url));

  // Return error
  if (err) throw err;

  // Format query parameters into array of objects
  params = Object.keys(response.data[name]).map(key => {
    const value = response.data[name][key];

    return { name: key, type: getType(value) };
  });

  return params;
};

module.exports = {
  getClusterByID,
  getClusters,
  getDataFromCluster,
  getQueryDatasetsFromCluster,
  getQueryListFromCluster,
  getQueryParamsFromCluster,
};
