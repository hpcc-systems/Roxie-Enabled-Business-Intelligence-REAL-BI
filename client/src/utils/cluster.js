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
