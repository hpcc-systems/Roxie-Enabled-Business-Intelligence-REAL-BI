const axios = require('axios');
const moment = require('moment');
const { parseStringPromise } = require('xml2js');
const { Topology, Workunit } = require('@hpcc-js/comms');
const { getClusterCreds } = require('./clusterCredentials');

const getTargetClusters = async (cluster, userID) => {
  const { id: clusterID, host, infoPort } = cluster;
  const { password, username } = await getClusterCreds(clusterID, userID);

  const topology = new Topology({
    baseUrl: `${host}:${infoPort}`,
    type: 'POST',
    userID: username,
    password: password,
  });

  return await topology.fetchTargetClusters();
};

const getECLscript = async (fileName, cluster, userID) => {
  const { id: clusterID, host, infoPort } = cluster;
  const clusterCreds = await getClusterCreds(clusterID, userID);

  try {
    //Getting ECL script
    const hpccFile = await axios.post(
      `${host}:${infoPort}/WsDfu/DFUInfo?ver_=1.55&json_builder_`,
      {
        DFUInfoRequest: {
          Name: fileName,
        },
      },
      { auth: clusterCreds },
    );
    const eclScript = hpccFile?.data?.DFUInfoResponse?.FileDetail?.Ecl;
    const nodeGroup = hpccFile?.data?.DFUInfoResponse?.FileDetail?.NodeGroup;
    let wuid = hpccFile?.data?.DFUInfoResponse?.FileDetail?.Wuid;

    if (!wuid || !eclScript || !nodeGroup) {
      throw new Error(`Can not find a script for ${fileName}.`);
    }

    const hpccWorkUnit = await axios.post(
      `${host}:${infoPort}/WsWorkunits/WUInfo?ver_=1.78&json_builder_`,
      {
        WUInfoRequest: {
          Wuid: wuid,
        },
      },
      { auth: clusterCreds },
    );
    const clusterName = hpccWorkUnit.data.WUInfoResponse.Workunit.Cluster;

    return { eclScript, nodeGroup, wuid, clusterName };
  } catch (error) {
    throw new Error(`${error?.response?.data || error.message || 'Unknown error'}`);
  }
};

const submitWorkunitToCluster = async (cluster, targetCluster, eclScript, userID) => {
  const { id: clusterID, host, infoPort } = cluster;
  const { password, username } = await getClusterCreds(clusterID, userID);

  try {
    const response = await Workunit.submit(
      {
        baseUrl: `${host}:${infoPort}`,
        type: 'POST',
        userID: username,
        password: password,
      },
      targetCluster,
      eclScript,
    );

    // Watch workunit until it completes
    await response.watchUntilComplete();

    if (response.isFailed()) {
      const errors = await response.fetchECLExceptions();
      return { errors, workunit: response };
    } else {
      await response.fetchResults();

      const { CResults = 0 } = response;
      const outputCount = response.CResults.length > 0 ? CResults.length : 1;
      const _result = CResults[outputCount - 1];

      const rows = await _result.fetchRows();
      return { data: rows, errors: [], result: _result, workunit: response };
    }
  } catch (error) {
    throw new Error(`${error.response.data ? error.response.data : 'Unknown error'}`);
  }
};

const getECLParamsFromScript = async (cluster, Wuid, userID) => {
  const { id: clusterID, host, infoPort } = cluster;
  const clusterCreds = await getClusterCreds(clusterID, userID);
  let data;

  try {
    const response = await axios.post(
      `${host}:${infoPort}/WsWorkunits/WUInfo.json`,
      { WUInfoRequest: { Wuid } },
      { auth: clusterCreds },
    );
    data = response.data;
  } catch (error) {
    throw new Error(`${error.response.data ? error.response.data : 'Unknown error'}`);
  }

  if (data.Exceptions) {
    const { Code, Message } = data.Exceptions.Exception[0];
    throw new Error(`${Code} -> ${Message}`);
  }

  const variables = data.WUInfoResponse.Workunit.Variables;

  if (!variables) return [];

  const params = variables.ECLResult.map(({ Name }) => ({
    name: Name,
    type: '',
    value: null,
  }));

  return params;
};

const getWorkunitDataFromCluster = async (cluster, configuration, source, userID) => {
  const { id: clusterID, host, infoPort } = cluster;
  const clusterCreds = await getClusterCreds(clusterID, userID);
  const { Count } = createWUParams(configuration.params);
  let data;

  try {
    const response = await axios.post(
      `${host}:${infoPort}/WsWorkunits/WUResult.json`,
      {
        WUResultRequest: {
          Wuid: source.hpccID,
          Cluster: source.target,
          ResultName: configuration.dataset,
          Count,
        },
      },
      { auth: clusterCreds },
    );
    data = response.data;
  } catch (error) {
    throw new Error(`${error.response.data ? error.response.data : 'Unknown error'}`);
  }

  if (data.Exceptions) {
    const { Code, Message } = data.Exceptions.Exception[0];
    throw new Error(`${Code} -> ${Message}`);
  }

  data = data?.WUResultResponse?.Result?.[configuration.dataset]?.Row || [];

  return { lastModifiedDate: createScriptLastModifiedDate(), data };
};

const getWorkunitDataFromClusterWithParams = async (cluster, configuration, paramsArr, source, userID) => {
  const { id: clusterID, host, infoPort } = cluster;
  const clusterCreds = await getClusterCreds(clusterID, userID);
  const { Count, params } = createWUParams(paramsArr);
  let data;

  try {
    const response = await axios.post(
      `${host}:${infoPort}/WsWorkunits/WURun.json`,
      {
        WURunRequest: {
          Wuid: source.hpccID,
          Cluster: source.target,
          Variables: { NamedValue: params.length > 0 ? params : [{ Name: '', Value: '' }] },
          ExceptionSeverity: 'error',
        },
      },
      { auth: clusterCreds },
    );
    data = response?.data;
  } catch (error) {
    throw new Error(`${error?.response?.data || 'Unknown error'}`);
  }

  if (data?.Exceptions) {
    const { Code, Message } = data.Exceptions?.Exception[0];
    throw new Error(`${Code} -> ${Message}`);
  }

  if (!data?.WURunResponse?.Results) {
    return { lastModifiedDate: createScriptLastModifiedDate(), data: [] };
  }

  const parsedXML = await parseStringPromise(data.WURunResponse.Results);
  const dataObj = parsedXML.Result.Dataset.find(obj => obj['$'].name === configuration.dataset);
  const schemaArr = configuration.ecl.schema.map(({ name }) => name);
  data = [];

  if (Object.keys(dataObj).length > 0 && dataObj.Row) {
    dataObj.Row.forEach(obj => {
      const newObj = {};
      schemaArr.forEach(field => (newObj[field] = obj[field].join('')));

      data.push(newObj);
    });
  }

  // Reduce data array to number of specified rows
  return { lastModifiedDate: createScriptLastModifiedDate(), data: data.slice(0, Count) };
};

const createWUParams = params => {
  if (!params) return [];

  let Count = params.find(({ name }) => name === 'Count');
  Count = Count
    ? Count.value
      ? Count.value
      : process.env.DEFAULT_ROW_COUNT_RETURN
    : process.env.DEFAULT_ROW_COUNT_RETURN;

  // Remove empty params
  params = params.filter(({ name, value }) => name !== 'Count' && value !== null);
  params = params.map(({ name, value }) => ({ Name: name, Value: value }));

  return { Count, params };
};

const createScriptLastModifiedDate = () => {
  const datetime = moment().utc().format('L HH:mm:ss');

  return `${datetime} UTC`;
};

module.exports = {
  getECLscript,
  getECLParamsFromScript,
  getTargetClusters,
  getWorkunitDataFromCluster,
  getWorkunitDataFromClusterWithParams,
  submitWorkunitToCluster,
};
