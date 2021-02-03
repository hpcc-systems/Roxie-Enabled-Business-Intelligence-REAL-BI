const axios = require('axios');
const moment = require('moment');
const { getClusterCreds } = require('./clusterCredentials');
const { getValueType } = require('./misc');

const getFilesFromCluster = async (cluster, keyword, userID) => {
  const { host, id: clusterID, infoPort } = cluster;
  const clusterCreds = await getClusterCreds(clusterID, userID);
  let files;

  try {
    const response = await axios.post(
      `${host}:${infoPort}/WsDfu/DFUQuery.json`,
      { DFUQueryRequest: { LogicalName: `*${keyword}*` } },
      { auth: clusterCreds },
    );

    files = response?.data?.DFUQueryResponse;
  } catch (error) {
    throw new Error(`${error?.response?.data || 'Unknown error'}`);
  }

  if (!files?.DFULogicalFiles) {
    throw new Error(`No file with name like "*${keyword}*`);
  }

  files = files.DFULogicalFiles.DFULogicalFile;

  // Remove csv files from result set
  files = files.filter(({ Name }) => Name.indexOf('.csv') === -1 && Name.indexOf('::csv') === -1);

  files = files.map(({ ClusterName, Name }) => ({
    cluster: ClusterName,
    hpccID: Name,
    name: Name,
    target: 'file',
  }));

  return files;
};

const getFileDatasetFromCluster = async (cluster, source, userID) => {
  const { host, id: clusterID, infoPort } = cluster;
  const clusterCreds = await getClusterCreds(clusterID, userID);
  let fields, response;

  try {
    response = await axios.post(
      `${host}:${infoPort}/WsDfu/DFUGetFileMetaData.json`,
      { DFUGetFileMetaDataRequest: { LogicalFileName: source.name } },
      { auth: clusterCreds },
    );
  } catch (error) {
    throw new Error(`${error.response.data ? error.response.data : 'Unknown error'}`);
  }

  if (response.data.Exceptions) {
    const { Code, Message } = response.data.Exceptions.Exception[0];
    throw new Error(`${Code} -> ${Message}`);
  }

  fields = response.data.DFUGetFileMetaDataResponse.DataColumns.DFUDataColumn;

  fields = fields.map(({ ColumnLabel, ColumnType }) => ({
    name: ColumnLabel,
    type: getValueType(ColumnType),
  }));
  fields = fields.filter(({ name }) => name !== '__fileposition__');

  const params = [
    { name: 'Start', type: 'number', value: '' },
    { name: 'Count', type: 'number', value: '' },
  ];

  fields.forEach(field => params.push({ ...field, value: '' }));

  return { name: source.name, fields, params };
};

const getFileDataFromCluster = async (cluster, options, userID) => {
  const { host, id: clusterID, infoPort } = cluster;
  const { source, params } = options;
  const clusterCreds = await getClusterCreds(clusterID, userID);
  const { Count, params: fileParams, Start } = createFileParams(params);
  let data;

  try {
    const response = await axios.post(
      `${host}:${infoPort}/WsWorkunits/WUResult.json`,
      {
        WUResultRequest: {
          LogicalName: source.name,
          FilterBy: { NamedValue: fileParams },
          Start,
          Count,
        },
      },
      { auth: clusterCreds },
    );

    data = response.data.WUResultResponse;
  } catch (error) {
    console.error(error);
    throw new Error(`${error.response.data ? error.response.data : 'Unknown error'}`);
  }

  const lastModifiedDate = await getFileLastModifiedDate(cluster, source.name, clusterCreds);

  if (data.Exceptions) {
    const { Code, Message } = data.Exceptions.Exception[0];
    throw new Error(`${Code} -> ${Message}`);
  }

  data = data.Result.Row || [];

  return { data, lastModifiedDate };
};

const getFileLastModifiedDate = async (cluster, fileName, clusterCreds) => {
  const { host, infoPort } = cluster;
  let file;

  try {
    const response = await axios.post(
      `${host}:${infoPort}/WsDfu/DFUQuery.json`,
      { DFUQueryRequest: { LogicalName: fileName } },
      { auth: clusterCreds },
    );

    file = response.data.DFUQueryResponse.DFULogicalFiles.DFULogicalFile[0];
  } catch (error) {
    throw new Error(`${error.response.data ? error.response.data : 'Unknown error'}`);
  }

  if (!file) throw new Error('No Matching Filename Found');

  return `${moment(file.Modified).format('L HH:mm:ss')} UTC`;
};

const createFileParams = (params = []) => {
  let Count = params.find(({ name }) => name === 'Count');
  let Start = params.find(({ name }) => name === 'Start');

  Count = Count
    ? Count.value
      ? Count.value
      : process.env.DEFAULT_ROW_COUNT_RETURN
    : process.env.DEFAULT_ROW_COUNT_RETURN;
  Start = Start > 0 ? Start.value - 1 : 0; // Convert start value back to 0 index

  params = params.filter(({ name, value }) => name !== 'Start' && name !== 'Count' && value);
  params = params.map(({ name, value }) => ({ Name: name, Value: value }));

  return { Count, params, Start };
};

module.exports = {
  getFileDataFromCluster,
  getFileDatasetFromCluster,
  getFileLastModifiedDate,
  getFilesFromCluster,
};
