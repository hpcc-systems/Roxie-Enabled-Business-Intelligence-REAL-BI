import axios from 'axios';
import jsonToPivotjson from 'json-to-pivot-json';

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

const groupByField = (data, options) => {
  return jsonToPivotjson(data, options);
};

export { getChartData, getPreviewData, groupByField };
