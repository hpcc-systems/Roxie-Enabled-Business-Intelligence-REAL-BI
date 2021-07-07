/* eslint-disable no-throw-literal */
import axios from 'axios';

export const getKeywordSearchResults = async (clusterID, keyword, sourceType) => {
  try {
    const response = await axios.get('/api/v1/hpcc/keyword', { params: { clusterID, keyword, sourceType } });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getDatasetsFromSource = async (clusterID, source, sourceType) => {
  try {
    const response = await axios.get('/api/v1/hpcc/datasets', {
      params: { clusterID, source, sourceType },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getChartPreviewData = async (clusterID, dataOptions, sourceType) => {
  try {
    const response = await axios.get('/api/v1/hpcc/preview_data', {
      params: { clusterID, dataOptions, sourceType },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getTargetClustersForEditor = async clusterID => {
  try {
    const response = await axios.post('/api/v1/hpcc/editor/clusters', { clusterID });

    return response.data;
  } catch (error) {
    if (error.response.status === 504) {
      throw { message: 'Gateway Timeout' };
    }

    throw error.response.data;
  }
};

export const submitWorkunit = async (clusterID, targetCluster, eclScript) => {
  try {
    const response = await axios.post('/api/v1/hpcc/editor/submit_workunit', {
      clusterID,
      targetCluster,
      eclScript,
    });

    return response.data;
  } catch (error) {
    if (error.response.status === 504) {
      throw { message: 'Gateway Timeout' };
    }

    throw error.response.data;
  }
};

export const getECLParams = async (clusterID, Wuid) => {
  try {
    const response = await axios.post('/api/v1/hpcc/editor/params', { clusterID, Wuid });

    return response.data;
  } catch (error) {
    if (error.response.status === 504) {
      throw { message: 'Gateway Timeout' };
    }

    throw error.response.data;
  }
};

export const getTreeViewData = async (scope, clusterId) => {
  try {
    const response = await axios.post('/api/v1/hpcc/treeViewData', { scope, clusterId });

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
/* eslint-enable no-throw-literal */
