const qs = require('qs');
const axios = require('axios');
const moment = require('moment');
const { getClusterCreds } = require('./clusterCredentials');
const { getValueType } = require('./misc');

const getQueriesFromCluster = async (cluster, keyword, userID) => {
  const { host, id: clusterID, infoPort } = cluster;
  const clusterCreds = await getClusterCreds(clusterID, userID);
  let queries;

  try {
    const response = await axios.get(
      `${host}:${infoPort}/WsWorkunits/WUListQueries.json?Activated=true&QuerySetName=roxie&QueryName=*${keyword}*`,
      { auth: clusterCreds },
    );
    queries = response.data.WUListQueriesResponse.QuerysetQueries;
  } catch (error) {
    throw new Error(`${error.response.data ? error.response.data : 'Unknown error'}`);
  }

  if (!queries || queries.QuerySetQuery.length === 0) {
    throw new Error(`No query with name like "*${keyword}*`);
  }

  queries = queries.QuerySetQuery;

  // Remove duplicates from queries array
  queries = Array.from(new Set(queries.map(({ Id }) => Id))).map(Id => {
    return queries.find(({ Id: Id2 }) => Id2 === Id);
  });

  // Reduce objects to only desired keys
  queries = queries.map(({ Clusters, Id, Name, QuerySetId }) => {
    const cluster = Clusters.ClusterQueryState[0].Cluster;
    return { cluster, hpccID: Id, name: Name, target: QuerySetId };
  });

  return queries;
};

const getQueryDatasetsFromCluster = async (cluster, source, userID) => {
  const { host, id: clusterID, dataPort } = cluster;
  const { name, target } = source;
  const clusterCreds = await getClusterCreds(clusterID, userID);
  let datasets;

  try {
    const response = await axios.get(
      `${host}:${dataPort}/WsEcl/example/response/query/${target}/${name}/json?display`,
      { auth: clusterCreds },
    );
    datasets = response.data[`${name}Response`].Results;
  } catch (error) {
    throw new Error(`${error.response.data ? error.response.data : 'Unknown error'}`);
  }

  if (!datasets) {
    throw new Error('No dataset results for given query');
  }

  // Create array of formatted objects
  datasets = Object.keys(datasets).map(dataset => ({
    name: dataset,
    fields: getDatasetFields(datasets[dataset].Row),
  }));

  return datasets;
};

const getQueryParamsFromCluster = async (cluster, source, userID) => {
  const { host, id: clusterID, dataPort } = cluster;
  const { name, target } = source;
  const clusterCreds = await getClusterCreds(clusterID, userID);

  try {
    const response = await axios.get(
      `${host}:${dataPort}/WsEcl/example/request/query/${target}/${name}/json?display`,
      { auth: clusterCreds },
    );

    // Format query parameters into array of objects
    const params = Object.keys(response.data[name]).map(key => ({
      name: key,
      type: getValueType(response.data[name][key]),
      value: '',
    }));

    return params;
  } catch (error) {
    throw new Error(`${error.response.data ? error.response.data : 'Unknown error'}`);
  }
};

const getQueryDataFromCluster = async (cluster, options, userID) => {
  const { id: clusterID, host, dataPort } = cluster;
  const { name, target } = options.source;
  const clusterCreds = await getClusterCreds(clusterID, userID);
  const paramsList = createUrlParamsString(options.params);
  let data;

  try {
    const response = await axios.get(
      `${host}:${dataPort}/WsEcl/submit/query/${target}/${name}/json${paramsList}`,
      { auth: clusterCreds },
    );
    data = response.data[`${name}Response`];
  } catch (error) {
    throw new Error(`${error.response.data ? error.response.data : 'Unknown error'}`);
  }

  if (!data.Results || data.Results.length === 0) {
    throw new Error('No data received from cluster');
  }

  data = data.Results[options.dataset].Row || [];

  return { data, lastModifiedDate: createQueryLastModifiedDate() };
};

const getDatasetFields = dataset => {
  const fields = [];

  dataset.forEach(datasetObj => {
    Object.keys(datasetObj).forEach(key => {
      fields.push({ name: key, type: getValueType(datasetObj[key]) });
    });
  });

  return fields;
};

const createUrlParamsString = params => {
  if (!params || params.length === 0) return '';

  let urlString = '';
  params = params.filter(({ value }) => value !== '' && value !== null);
  params.forEach(
    ({ name, value }) => (urlString += qs.stringify({ [name]: value }, { encodeValuesOnly: true })),
  );

  return `?${urlString}`;
};

const createQueryLastModifiedDate = () => {
  const datetime = moment()
    .utc()
    .format('L HH:mm:ss');

  return `${datetime} UTC`;
};

module.exports = {
  createQueryLastModifiedDate,
  getQueriesFromCluster,
  getQueryDataFromCluster,
  getQueryDatasetsFromCluster,
  getQueryParamsFromCluster,
};
