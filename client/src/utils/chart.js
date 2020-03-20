import axios from 'axios';
import jsonToPivotjson from 'json-to-pivot-json';

const getChartData = async (chartID, clusterID) => {
  let response;

  try {
    response = await axios.get('/api/query/data/multiple', { params: { chartID, clusterID } });
  } catch (err) {
    console.error(err);
    return [];
  }

  return response.data;
};

const getPreviewData = async (clusterID, dataOptions) => {
  let response;

  try {
    response = await axios.get('/api/query/editordata', { params: { clusterID, dataOptions } });
  } catch (err) {
    console.error(err);
    return [];
  }

  return response.data;
};

const groupByField = (data, options) => {
  return jsonToPivotjson(data, options);
};

const createChartObj = (localState, sort) => {
  const { chartType, dataset, groupBy, options, params } = localState;

  return { dataset, groupBy, options, params, sort, type: chartType };
};

const setEditorState = (charts, chartID) => {
  // Get desired chart
  const chartIndex = charts.map(({ id }) => id).indexOf(chartID);
  const { id, queryName, type, ...chartKeys } = charts[chartIndex];

  // Create initial state object
  let initState = {
    chartID: id,
    chartType: type,
    dataObj: { loading: false },
    datasets: [],
    keyword: queryName,
    queries: [],
    selectedDataset: {},
    selectedQuery: {},
    ...chartKeys,
  };

  return initState;
};

const checkForChartParams = chartsArr => {
  let exists = false;

  // use for-loop to allow for "break"
  for (let i = 0; i < chartsArr.length; i++) {
    const { params = [] } = chartsArr[i];
    const hasParamValue = params.some(({ value }) => value !== null);

    if (hasParamValue) {
      exists = true;
      break;
    }
  }

  return exists;
};

export {
  checkForChartParams,
  createChartObj,
  getChartData,
  getPreviewData,
  groupByField,
  setEditorState,
};
