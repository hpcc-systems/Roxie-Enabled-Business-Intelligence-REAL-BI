import axios from 'axios';

const getSources = async (clusterID, keyword, sourceType) => {
  let response;

  try {
    response = await axios.get('/api/source/search', { params: { clusterID, keyword, sourceType } });
  } catch (err) {
    console.error(err);
    return [];
  }

  return response.data;
};

const addSource = async (dashboardID, source) => {
  let response;

  try {
    response = await axios.post('/api/source/create', { dashboardID, source });
  } catch (err) {
    console.error(err);
    return;
  }

  const { id: sourceID, name: sourceName } = response.data;

  return { sourceID, sourceName };
};

const getSourceInfo = async (clusterID, source, sourceType) => {
  let response;

  try {
    response = await axios.get('/api/source/info', { params: { clusterID, source, sourceType } });
  } catch (err) {
    console.error(err);
    return {};
  }

  return response.data;
};

const createSourceObj = localState => {
  const {
    selectedSource: { target, hpccID, name },
    sourceType,
  } = localState;

  return { hpccID, name, target, type: sourceType };
};

const getUniqueSources = charts => {
  // Get unique source values
  const uniqueSources = Array.from(new Set(charts.map(({ sourceID }) => sourceID))).map(sourceID => {
    return charts.find(({ sourceID: sourceID2 }) => sourceID === sourceID2);
  });

  return uniqueSources;
};

export { addSource, createSourceObj, getSources, getSourceInfo, getUniqueSources };
