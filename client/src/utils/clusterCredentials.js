import axios from 'axios';

export const checkForClusterCreds = async clusterID => {
  try {
    const response = await axios.get('/api/v1/cluster_credentials/check', { params: { clusterID } });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createClusterCreds = async authObj => {
  try {
    return await axios.post('/api/v1/cluster_credentials/', { ...authObj });
  } catch (error) {
    throw error.response.data;
  }
};

export const updateClusterCreds = async authObj => {
  try {
    return await axios.put('/api/v1/cluster_credentials/', { ...authObj });
  } catch (error) {
    throw error.response.data;
  }
};
