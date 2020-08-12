import axios from 'axios';
import errHandler from './errHandler';

export const getSources = async (clusterID, keyword, sourceType) => {
  let response;

  try {
    response = await axios.get('/api/source/search', { params: { clusterID, keyword, sourceType } });
  } catch (err) {
    const { errMsg, status } = errHandler(err);

    if (status === 401) {
      return errMsg;
    }

    return [];
  }

  return response.data;
};

export const addSource = async (dashboardID, source) => {
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

export const getSourceInfo = async (clusterID, source, sourceType) => {
  let response;

  try {
    response = await axios.get('/api/source/info', { params: { clusterID, source, sourceType } });
  } catch (err) {
    console.error(err);
    return {};
  }

  return response.data;
};

export const createSourceObj = (localState, eclRef) => {
  const {
    selectedSource: { target, hpccID, name },
    sourceType,
  } = localState;
  const { cluster, workunitID } = eclRef.current;

  if (sourceType === 'ecl') {
    return { hpccID: workunitID, name: workunitID, target: cluster, type: sourceType };
  }

  return { hpccID, name, target, type: sourceType };
};

export const getUniqueSources = charts => {
  // Get unique source values
  const uniqueSources = Array.from(new Set(charts.map(({ sourceID }) => sourceID))).map(sourceID => {
    return charts.find(({ sourceID: sourceID2 }) => sourceID === sourceID2);
  });

  return uniqueSources;
};
