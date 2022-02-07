const axios = require('axios');
const moment = require('moment');
const { getClusterCreds } = require('./clusterCredentials');
const { getValueType } = require('./misc');

const getTreeViewDataFromCluster = async (cluster, userId, scope) => {
  const { host, id, infoPort } = cluster;

  try {
    const clusterCreds = await getClusterCreds(id, userId);

    const request = {
      DFUFileViewRequest: {
        Scope: scope,
        IncludeSuperOwner: false,
      },
    };

    const response = await axios.post(`${host}:${infoPort}/WsDfu/DFUFileView.json`, request, {
      auth: clusterCreds,
    });

    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      throw new Error(
        `Your request can not be completed, please provide valid cluster cretentials in dashboard settings.`,
      );
    } else {
      throw new Error(`${error?.response?.data ? error.response.data : 'Unknown error'}`);
    }
  }
};

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
    if (error?.response?.status === 401) {
      throw new Error(
        `Your request can not be completed, please provide valid cluster credentials in dashboard settings.`,
      );
    } else {
      throw new Error(`${error?.response?.data ? error.response.data : 'Unknown error'}`);
    }
  }

  if (!files?.DFULogicalFiles) {
    throw new Error(`No file with name like "*${keyword}*`);
  }

  files = files.DFULogicalFiles.DFULogicalFile;

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
    if (error?.response?.status === 401) {
      throw new Error(
        `Your request can not be completed, please provide valid cluster credentials in dashboard settings.`,
      );
    } else {
      throw new Error(`${error?.response?.data ? error.response.data : 'Unknown error'}`);
    }
  }

  if (response.data.Exceptions) {
    const { Code, Message } = response.data.Exceptions.Exception[0];
    throw new Error(`${Code} -> ${Message}`);
  }

  fields = response.data.DFUGetFileMetaDataResponse.DataColumns.DFUDataColumn;

  const params = [
    { name: 'Start', type: 'number', value: '' },
    { name: 'Count', type: 'number', value: '' },
  ];

  fields = fields.reduce((acc, el) => {
    if (el.ColumnLabel !== '__fileposition__') {
      const field = {
        name: el.ColumnLabel,
        type: getValueType(el.ColumnType),
      };
      params.push({ ...field, value: '' }); // adding field to pararms array
      acc.push(field); // adding filed to fields array
    }
    return acc;
  }, []);

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
    if (error?.response?.status === 401) {
      throw new Error(
        `Your request can not be completed, please provide valid cluster credentials in dashboard settings.`,
      );
    } else {
      throw new Error(`${error?.response?.data ? error.response.data : 'Unknown error'}`);
    }
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
  try {
    const { host, infoPort } = cluster;

    const response = await axios.post(
      `${host}:${infoPort}/WsDfu/DFUQuery.json`,
      { DFUQueryRequest: { LogicalName: fileName } },
      { auth: clusterCreds },
    );

    const file = response.data?.DFUQueryResponse?.DFULogicalFiles?.DFULogicalFile?.[0];
    if (!file) return 'No information about last modified date was found';

    return `${moment(file.Modified).format('L HH:mm:ss')} UTC`;
  } catch (error) {
    console.log('error', error);
    return 'No information about last modified date was found';
  }
};

const createFileParams = (params = []) => {
  const result = params.reduce(
    (acc, el) => {
      if (el.name === 'Count') {
        acc.Count = el.value || process.env.DEFAULT_ROW_COUNT_RETURN;
      } else if (el.name === 'Start') {
        acc.Start = el.value > 0 ? parseInt(el.value) - 1 : 0;
      } else {
        if (el.value && el.name) {
          const param = { Name: el.name, Value: el.value };
          acc.params.push(param);
        }
      }
      return acc;
    },
    {
      Count: process.env.DEFAULT_ROW_COUNT_RETURN,
      Start: 0,
      params: [],
    },
  );

  return result;
};

module.exports = {
  getFileDataFromCluster,
  getFileDatasetFromCluster,
  getFileLastModifiedDate,
  getFilesFromCluster,
  getTreeViewDataFromCluster,
};
