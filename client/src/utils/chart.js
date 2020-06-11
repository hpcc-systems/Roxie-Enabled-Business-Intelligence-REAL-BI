import axios from 'axios';

// Constants
import { hasGroupByOption, hasHorizontalOption, hasStackedOption } from '../utils/misc';

const getChartData = async (chartID, clusterID) => {
  let response;

  try {
    response = await axios.get('/api/source/data/multiple', { params: { chartID, clusterID } });
  } catch (err) {
    console.error(err);
    return [];
  }

  return response.data;
};

const getPreviewData = async (clusterID, dataOptions, sourceType) => {
  let response;

  try {
    response = await axios.get('/api/source/editordata', { params: { clusterID, dataOptions, sourceType } });
  } catch (err) {
    console.error(err);
    return [];
  }

  return response.data;
};

const createChartObj = localState => {
  const { chartType, dataset, params } = localState;
  let { options } = localState;
  const { groupBy, horizontal, stacked } = options;

  // Change horizontal value if it doesn't apply to the chart type or is missing
  if ((!hasHorizontalOption(chartType) && horizontal) || !('horizontal' in options)) {
    options = { ...options, horizontal: false };
  }

  // Change stacked value if it doesn't apply to the chart type or is missing
  if ((!hasStackedOption(chartType) && stacked) || !('stacked' in options)) {
    options = { ...options, stacked: false };
  }

  // Change groupBy value if it doesn't apply to the chart type or is missing
  if ((!hasGroupByOption(chartType) && groupBy) || !('groupBy' in options)) {
    options = { ...options, groupBy: '' };
  }

  return { dataset, options, params, type: chartType };
};

const setEditorState = (charts, chartID) => {
  // Get desired chart
  const chartIndex = charts.map(({ id }) => id).indexOf(chartID);
  const { id, sourceName, type, ...chartKeys } = charts[chartIndex];

  // Create initial state object
  let initState = {
    chartID: id,
    chartType: type,
    dataObj: { loading: false },
    datasets: [],
    keyword: sourceName,
    sources: [],
    selectedDataset: {},
    selectedSource: {},
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

export { checkForChartParams, createChartObj, getChartData, getPreviewData, setEditorState };
