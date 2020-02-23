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

const getPreviewData = async chart => {
  console.log('chart', chart);
  // let response;

  // try {
  //   response = await axios.get('/api/query/editordata', { params: chart });
  // } catch (err) {
  //   console.error(err);
  //   return [];
  // }

  // return response.data;
};

export { getChartData, getPreviewData };
