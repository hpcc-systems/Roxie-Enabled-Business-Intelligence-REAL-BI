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

const changeChartType = (oldType, newType, options) => {
  let newOptions = { ...options };

  //  Update values in options object to reflect the current chart type
  switch (oldType) {
    case 'pie':
      if (newType === 'bar' || newType === 'line') {
        newOptions.xAxis = newOptions.name;
        newOptions.yAxis = newOptions.value;
      } else if (newType === 'table') {
        newOptions.uniqueField = newOptions.name;
        newOptions.fields = [newOptions.name, newOptions.value];
      }

      delete newOptions.name;
      delete newOptions.value;

      break;
    case 'table':
      if (newType === 'bar' || newType === 'line') {
        newOptions.xAxis = newOptions.uniqueField;
        newOptions.yAxis = newOptions.fields[1] || '';
      } else if (newType === 'pie') {
        newOptions.name = newOptions.uniqueField;
        newOptions.value = newOptions.fields[1] || '';
      }

      delete newOptions.uniqueField;
      delete newOptions.fields;

      break;
    default:
      if (newType === 'pie') {
        newOptions.name = newOptions.xAxis;
        newOptions.value = newOptions.yAxis;

        delete newOptions.xAxis;
        delete newOptions.yAxis;
      } else if (newType === 'table') {
        newOptions.uniqueField = newOptions.xAxis;
        newOptions.fields = [newOptions.xAxis, newOptions.yAxis];

        delete newOptions.xAxis;
        delete newOptions.yAxis;
      }
  }

  // Change horizontal value if it doesn't apply to the chart type or is missing
  if ((!hasHorizontalOption(newType) && newOptions.horizontal) || !('horizontal' in newOptions)) {
    newOptions = { ...newOptions, horizontal: false };
  }

  // Change stacked value if it doesn't apply to the chart type or is missing
  if ((!hasStackedOption(newType) && newOptions.stacked) || !('stacked' in newOptions)) {
    newOptions = { ...newOptions, stacked: false };
  }

  // Change groupBy value if it doesn't apply to the chart type or is missing
  if ((!hasGroupByOption(newType) && newOptions.groupBy) || !('groupBy' in newOptions)) {
    newOptions = { ...newOptions, groupBy: '' };
  }

  return newOptions;
};

export { changeChartType, checkForChartParams, createChartObj, getChartData, getPreviewData, setEditorState };
