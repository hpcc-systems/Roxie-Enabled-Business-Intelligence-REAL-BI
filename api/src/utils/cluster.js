const axios = require('axios');
const parseStringPromise = require('xml2js').parseStringPromise;

// DB Models
const { cluster: clusterModel } = require('../models');

// Utils
const { getClusterAuth } = require('./clusterAuth');
const {
  awaitHandler,
  createFileParams,
  createParamString,
  createWUParams,
  findQueryDatasets,
  getDatasetFields,
  getType,
  unNestSequelizeObj,
} = require('./misc');

// Constants
const { DEFAULT_ROW_COUNT_RETURN } = process.env;

const logger = require('../config/logger');

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

  // Log API request
  logger.info(`Request made to ${url}`);

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

  // Log API request
  logger.info(`Request made to ${url}`);

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

  // Log API request
  logger.info(`Request made to ${url}`);

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

  // Remove csv files from result set
  files = files.filter(({ Name }) => Name.indexOf('.csv') === -1);

  // Change JSON key labels
  files = files.map(({ ClusterName, Name }) => ({
    cluster: ClusterName,
    hpccID: Name,
    name: Name,
    target: 'file',
  }));

  return files;
};

const getQueryListFromCluster = async ({ id: clusterID, host, infoPort }, keyword, userID) => {
  const clusterAuth = await getClusterAuth(clusterID, userID);
  let queries;

  // Build URL from cluster details and keyword provided by user
  const url = `${host}:${infoPort}/WsWorkunits/WUListQueries.json?Activated=true&QuerySetName=roxie&QueryName=*${keyword}*`;

  // Log API request
  logger.info(`Request made to ${url}`);

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
  queries = queries.map(({ Clusters, Id, Name, QuerySetId }) => {
    // Get cluster name
    const cluster = Clusters.ClusterQueryState[0].Cluster;

    return { cluster, hpccID: Id, name: Name, target: QuerySetId };
  });

  return queries;
};

const getFileMetaDataFromCluster = async ({ id: clusterID, host, infoPort }, { name: filename }, userID) => {
  const clusterAuth = await getClusterAuth(clusterID, userID);
  let fields, params;

  // Build URL from cluster and file details
  const url = `${host}:${infoPort}/WsDfu/DFUGetFileMetaData.json`;

  // Log API request
  logger.info(`Request made to ${url}`);

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
  fields = response.map(({ ColumnLabel, ColumnType }) => ({ name: ColumnLabel, type: getType(ColumnType) }));

  // Remove __fileposition__ field from result set
  fields = fields.filter(({ name }) => name !== '__fileposition__');

  // Set params default array
  params = [
    { name: 'Start', type: 'number', value: '' },
    { name: 'Count', type: 'number', value: '' },
  ];

  // Add fields to params array for dynamic params
  fields.forEach(field => params.push({ ...field, value: '' }));

  return { name: filename, fields, params };
};

const getFileDataFromCluster = async ({ id: clusterID, host, infoPort }, { source, params }, userID) => {
  const { name: filename } = source;
  const clusterAuth = await getClusterAuth(clusterID, userID);

  // Build URL from cluster and file details
  const url = `${host}:${infoPort}/WsWorkunits/WUResult.json`;
  const { Count, formattedParams, Start } = createFileParams(params);

  let requestBody = { LogicalName: filename, FilterBy: { NamedValue: formattedParams }, Start, Count };

  // Log API request
  logger.info(`Request made to ${url} with body '${JSON.stringify(requestBody)}'`);

  let [err, response] = await awaitHandler(
    axios.post(url, { WUResultRequest: requestBody }, { auth: clusterAuth }),
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

const getWorkunitDataFromCluster = async (cluster, config, source, userID) => {
  const { id: clusterID, host, infoPort } = cluster;
  const { dataset } = config;
  const { hpccID: workunitID, target } = source;
  const clusterAuth = await getClusterAuth(clusterID, userID);

  // Build URL from cluster details
  const url = `${host}:${infoPort}/WsWorkunits/WUResult.json`;
  const requestBody = {
    WUResultRequest: {
      Wuid: workunitID,
      Cluster: target,
      ResultName: dataset,
      Count: DEFAULT_ROW_COUNT_RETURN,
    },
  };

  // Log API request
  logger.info(`Request made to ${url} with body '${JSON.stringify(requestBody)}'`);

  let [err, response] = await awaitHandler(axios.post(url, requestBody, { auth: clusterAuth }));

  // Return error
  if (err) throw err;

  // Check for exception
  if ('Exceptions' in response.data) {
    const { Code, Message } = response.data['Exceptions']['Exception'][0];
    throw `${Code} -> ${Message}`;
  }

  // Update variable to nested depth
  const { Row = [] } = response.data['WUResultResponse']['Result'][dataset];

  return { [dataset]: { Row } };
};

const getWorkunitDataFromClusterWithParams = async (cluster, config, params, source, userID) => {
  const { id: clusterID, host, infoPort } = cluster;
  const { dataset, ecl } = config;
  const { hpccID: workunitID, target } = source;
  const clusterAuth = await getClusterAuth(clusterID, userID);
  const formattedParams = createWUParams(params);
  const schemaArr = ecl.schema.map(({ name }) => name);

  // Build URL from cluster details
  const url = `${host}:${infoPort}/WsWorkunits/WURun.json`;
  const requestBody = {
    WURunRequest: {
      Wuid: workunitID,
      Cluster: target,
      Variables: { NamedValue: formattedParams },
      ExceptionSeverity: 'error',
    },
  };

  // No param values passed, update request body key
  // Equivalent to running ECL script with default values
  if (formattedParams.length === 0) {
    requestBody.WURunRequest.Variables = { NamedValue: [{ Name: '', Value: '' }] };
  }

  // Log API request
  logger.info(`Request made to ${url} with body '${JSON.stringify(requestBody)}'`);

  let [err, response] = await awaitHandler(axios.post(url, requestBody, { auth: clusterAuth }));

  // Return error
  if (err) throw err;

  // Check for exception
  if ('Exceptions' in response.data) {
    const { Code, Message } = response.data['Exceptions']['Exception'][0];
    throw `${Code} -> ${Message}`;
  }

  // Parse XML response to JSON
  const parsedXML = await parseStringPromise(response.data['WURunResponse']['Results']);

  // Get output that matches dataset targeted by user as charted dataset
  const dataObj = parsedXML.Result.Dataset.find(obj => obj['$'].name === dataset);
  const data = [];

  // Check that the dataObj is not empty
  if (Object.keys(dataObj).length > 0) {
    // Loop through data array
    dataObj.Row.forEach(obj => {
      const newObj = {};

      // Loop through script schema and add key/value to new object
      schemaArr.forEach(field => {
        return (newObj[field] = obj[field].join(''));
      });

      // Add new formatted object to data array
      data.push(newObj);
    });
  }

  return { [dataset]: { Row: data } };
};

const getQueryParamsFromCluster = async ({ id: clusterID, host, dataPort }, { name, target }, userID) => {
  const clusterAuth = await getClusterAuth(clusterID, userID);
  let params;

  // Build URL from cluster and query details
  const url = `${host}:${dataPort}/WsEcl/example/request/query/${target}/${name}/json?display`;

  // Log API request
  logger.info(`Request made to ${url}`);

  let [err, response] = await awaitHandler(axios.get(url, { auth: clusterAuth }));

  // Return error
  if (err) throw err;

  // Format query parameters into array of objects
  params = Object.keys(response.data[name]).map(key => {
    const value = response.data[name][key];

    return { name: key, type: getType(value), value: '' };
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
  getWorkunitDataFromCluster,
  getWorkunitDataFromClusterWithParams,
};
