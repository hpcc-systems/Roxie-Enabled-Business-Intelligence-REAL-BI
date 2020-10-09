import axios from 'axios';

export const getECLParams = async (clusterID, Wuid) => {
  let response;

  try {
    // Make call to get info for variables defined in ecl script
    response = await axios.post('/api/cluster/params', { clusterID, Wuid });
  } catch (err) {
    console.error(err.response);
    return [];
  }

  return response.data;
};

export const getTargetClusters = async clusterID => {
  let response;

  try {
    // Make call to get list of available target clusters
    response = await axios.post('/api/cluster/targetclusters', { clusterID });
  } catch (err) {
    throw err.response;
  }

  return response.data;
};

export const submitWorkunit = async (clusterID, targetCluster, eclScript) => {
  let response;

  try {
    // Make call to execute script on cluster
    response = await axios.post('/api/cluster/submitworkunit', { clusterID, targetCluster, eclScript });
  } catch (err) {
    throw err.response;
  }

  return response.data;
};
