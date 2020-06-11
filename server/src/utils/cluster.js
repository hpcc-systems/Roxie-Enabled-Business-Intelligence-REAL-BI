const axios = require('axios');

// DB Models
const { cluster: clusterModel } = require('../models');

// Utils
const { getClusterAuth } = require('./clusterAuth');
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

const getQueryDataFromCluster = async ({ id: clusterID, host, dataPort }, { params, source }, userID) => {
  const { name, target } = source;
  const paramsList = createParamString(params);
  const clusterAuth = await getClusterAuth(clusterID, userID);

  // Build URL from cluster and query details
  const url = `${host}:${dataPort}/WsEcl/submit/query/${target}/${name}/json${paramsList}`;

  let [err, response] = await awaitHandler(axios.get(url, { auth: clusterAuth }));

  // Return error
  if (err) throw err;

  // Get data array from response
  const { Results = [] } = response.data[`${name}Response`];

  return Results;
};

const getQueryDatasetsFromCluster = async ({ id: clusterID, host, dataPort }, { name, target }, userID) => {
  const clusterAuth = await getClusterAuth(clusterID, userID);
  let datasets;

  // Build URL from cluster and query details
  const url = `${host}:${dataPort}/WsEcl/example/response/query/${target}/${name}/json?display`;

  let [err, response] = await awaitHandler(axios.get(url, { auth: clusterAuth }));

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

const getLogicalFilesFromCluster = async ({ id: clusterID, host, infoPort }, keyword, userID) => {
  const clusterAuth = await getClusterAuth(clusterID, userID);
  let files;

  // Build URL from cluster details and keyword provided by user
  const url = `${host}:${infoPort}/WsDfu/DFUQuery.json`;

  let [err, response] = await awaitHandler(
    axios.post(url, { DFUQueryRequest: { LogicalName: `*${keyword}*` } }, { auth: clusterAuth }),
  );

  // Return error
  if (err) throw err;

  // Update variable to get nested JSON
  response = response.data['DFUQueryResponse'];

  // Error returned
  if (!response['DFULogicalFiles']) {
    throw 'No Matching Filename Found';
  }

  // Get array of columns from file
  files = response['DFULogicalFiles']['DFULogicalFile'];

  // Change JSON key labels
  files = files.map(({ Name }) => ({ hpccID: Name, name: Name, target: 'file' }));

  return files;
};

const getQueryListFromCluster = async ({ id: clusterID, host, infoPort }, keyword, userID) => {
  const clusterAuth = await getClusterAuth(clusterID, userID);
  let queries;

  // Build URL from cluster details and keyword provided by user
  const url = `${host}:${infoPort}/WsWorkunits/WUListQueries.json?Activated=true&QuerySetName=roxie&QueryName=*${keyword}*`;

  let [err, response] = await awaitHandler(axios.get(url, { auth: clusterAuth }));

  // Return error
  if (err) throw err;

  // Get nested query object
  const { QuerysetQueries = { QuerySetQuery: [] } } = response.data.WUListQueriesResponse;

  // Get array reference
  queries = QuerysetQueries.QuerySetQuery;

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

const getFileMetaDataFromCluster = async ({ id: clusterID, host, infoPort }, { name: filename }, userID) => {
  const clusterAuth = await getClusterAuth(clusterID, userID);
  let fields;

  // Build URL from cluster and query details
  const url = `${host}:${infoPort}/WsDfu/DFUGetFileMetaData.json`;

  let [err, response] = await awaitHandler(
    axios.post(url, { DFUGetFileMetaDataRequest: { LogicalFileName: filename } }, { auth: clusterAuth }),
  );

  // Return error
  if (err) throw err;

  // Check for exception
  if ('Exceptions' in response.data) {
    const { Code, Message } = response.data['Exceptions']['Exception'][0];
    throw `${Code} -> ${Message}`;
  }

  // Update variable to nested depth
  response = response.data['DFUGetFileMetaDataResponse']['DataColumns']['DFUDataColumn'];

  // Get necessary object key and rename it
  fields = response.map(({ ColumnLabel }) => ({ name: ColumnLabel }));

  return { name: filename, fields };
};

const getFileDataFromCluster = async ({ id: clusterID, host, infoPort }, { name: filename }, userID) => {
  const clusterAuth = await getClusterAuth(clusterID, userID);

  // Build URL from cluster and query details
  const url = `${host}:${infoPort}/WsWorkunits/WUResult.json`;

  let [err, response] = await awaitHandler(
    axios.post(url, { WUResultRequest: { LogicalName: filename } }, { auth: clusterAuth }),
  );

  // Return error
  if (err) throw err;

  // Check for exception
  if ('Exceptions' in response.data) {
    const { Code, Message } = response.data['Exceptions']['Exception'][0];
    throw `${Code} -> ${Message}`;
  }

  // Update variable to nested depth
  const { Row = [] } = response.data['WUResultResponse']['Result'];

  return { [filename]: { Row } };
};

const getQueryParamsFromCluster = async ({ id: clusterID, host, dataPort }, { name, target }, userID) => {
  const clusterAuth = await getClusterAuth(clusterID, userID);
  let params;

  // Build URL from cluster and query details
  const url = `${host}:${dataPort}/WsEcl/example/request/query/${target}/${name}/json?display`;

  let [err, response] = await awaitHandler(axios.get(url, { auth: clusterAuth }));

  // Return error
  if (err) throw err;

  // Format query parameters into array of objects
  params = Object.keys(response.data[name]).map(key => {
    const value = response.data[name][key];

    return { name: key, type: getType(value) };
  });

  return params;
};

const createCluster = async clusterObj => {
  let [err, newCluster] = await awaitHandler(clusterModel.create({ ...clusterObj }));

  // Return error
  if (err) throw err;

  newCluster = unNestSequelizeObj(newCluster);

  return newCluster;
};

module.exports = {
  createCluster,
  getClusterByID,
  getClusters,
  getFileMetaDataFromCluster,
  getFileDataFromCluster,
  getQueryDataFromCluster,
  getLogicalFilesFromCluster,
  getQueryDatasetsFromCluster,
  getQueryListFromCluster,
  getQueryParamsFromCluster,
};
