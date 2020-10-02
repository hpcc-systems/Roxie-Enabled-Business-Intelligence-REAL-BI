import axios from 'axios';

export const getECLParams = async (clusterID, Wuid) => {
  let params = [];

  try {
    // Make call to get info for variables defined in ecl script
    params = await axios.post('/api/cluster/params', { clusterID, Wuid });
  } catch (err) {
    console.error(err.response);
  }

  return params;
};
