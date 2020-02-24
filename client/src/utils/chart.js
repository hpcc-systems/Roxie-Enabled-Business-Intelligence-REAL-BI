import axios from 'axios';

const getChartData = async (chartID, clusterID) => {
  let response;

  try {
    response = await axios.get('/api/query/data', { params: { chartID, clusterID } });
  } catch (err) {
    console.error(err);
    return [];
  }

  return response.data;
};

const getPreviewData = async (chart, clusterID) => {
  let response;

  try {
    response = await axios.get('/api/query/editordata', { params: { chart, clusterID } });
  } catch (err) {
    console.error(err);
    return [];
  }

  return response.data;
};

export { getChartData, getPreviewData };
