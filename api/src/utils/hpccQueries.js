const moment = require('moment');
const { getHPCCService } = require('./hpccService');

const getQueriesFromCluster = async (cluster, keyword, userID, clusterCreds) => {
  try {
    const WUService = await getHPCCService('wu', userID, cluster, clusterCreds);

    const response = await WUService.WUListQueries({
      Activated: true,
      QuerySetName: 'roxie',
      QueryName: `*${keyword}*`,
    });

    const exceptions = response?.Exceptions?.Exception;

    if (exceptions?.length) {
      const message = exceptions.map(exception => exception.Message).join(', ');
      throw new Error(message);
    }

    const queries = response.QuerysetQueries?.QuerySetQuery;
    if (!queries?.length) throw new Error(`No query with name like "*${keyword}*`);

    const reduced = queries.reduce(
      (acc, el) => {
        if (!acc.duplicates.includes(el.Id)) {
          acc.duplicates.push(el.Id);
          const cluster = el.Clusters.ClusterQueryState[0].Cluster;
          const query = { cluster, hpccID: el.Id, name: el.Name, target: el.QuerySetId };
          acc.result.push(query);
        }
        return acc;
      },
      {
        duplicates: [],
        result: [],
      },
    );

    return reduced.result;
  } catch (error) {
    console.log('-getQueriesFromCluster error -------');
    console.dir({ error }, { depth: null });
    console.log('------------------------------------------');
    throw error;
  }
};
const getQueryDatasetsFromCluster = async (cluster, source, userID, clusterCreds) => {
  try {
    const { name, target } = source;

    const EclService = await getHPCCService('ecl', userID, cluster, clusterCreds);

    const response = await EclService.responseJson(target, name);

    const datasets = [];

    for (const dataset in response) {
      const serialized = {
        name: dataset,
        fields: response[dataset].map(field => ({ name: field.id, type: field.type })),
      };
      datasets.push(serialized);
    }

    return datasets;
  } catch (error) {
    console.log('-getQueryDatasetsFromCluster error -------');
    console.dir({ error }, { depth: null });
    console.log('------------------------------------------');
    throw error;
  }
};

const getQueryParamsFromCluster = async (cluster, source, userID, clusterCreds) => {
  try {
    const { name, target } = source;

    const EclService = await getHPCCService('ecl', userID, cluster, clusterCreds);

    const response = await EclService.requestJson(target, name);

    return response.map(field => ({ name: field.id, type: field.type, value: '' }));
  } catch (error) {
    console.log('--getQueryParamsFromCluster error---------');
    console.dir({ error }, { depth: null });
    console.log('------------------------------------------');
    throw error;
  }
};

const getQueryDataFromCluster = async (cluster, options, userID, clusterCreds) => {
  try {
    const { name, target } = options.source;

    const EclService = await getHPCCService('ecl', userID, cluster, clusterCreds);

    const response = await EclService.submit(target, name);

    const dataset = response[options.dataset]?.Row;

    if (!dataset) {
      console.log(' EclService.submit - NO DATASET-----------');
      console.dir({ response }, { depth: null });
      console.log('------------------------------------------');
      throw new Error('Dataset is not found');
    }

    return { data: dataset, lastModifiedDate: createQueryLastModifiedDate() };
  } catch (error) {
    console.log('-getQueryDataFromCluster error------------');
    console.dir({ error }, { depth: null });
    console.log('------------------------------------------');
    throw error;
  }
};

const createQueryLastModifiedDate = () => {
  const datetime = moment().utc().format('L HH:mm:ss');
  return `${datetime} UTC`;
};

module.exports = {
  createQueryLastModifiedDate,
  getQueriesFromCluster,
  getQueryDataFromCluster,
  getQueryDatasetsFromCluster,
  getQueryParamsFromCluster,
};
