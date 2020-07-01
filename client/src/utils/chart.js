import axios from 'axios';

// Constants
import { hasGroupByOption, hasHorizontalOption, hasStackedOption } from '../utils/misc';

//.env prop
const { REACT_APP_PROXY_URL } = process.env;

const getChartData = async (chartID, clusterID) => {
  let response;

  try {
    response = await axios.get(`${REACT_APP_PROXY_URL}/api/source/data/multiple`, {
      params: { chartID, clusterID },
    });
  } catch (err) {
    console.error(err);
    return [];
  }

  return response.data;
};

const getPreviewData = async (clusterID, dataOptions, sourceType) => {
  let response;

  try {
    response = await axios.get(`${REACT_APP_PROXY_URL}/api/source/editordata`, {
      params: { clusterID, dataOptions, sourceType },
    });
  } catch (err) {
    console.error(err);
    return [];
  }

  return response.data;
};

// Updates value field of objects in old array with ones updated in new array
export const mergeArrays = (oldArr, newArr) => {
  oldArr.forEach((obj, index) => {
    const matchedParam = newArr.find(({ name }) => name === obj.name);
    const newArrVal = matchedParam ? matchedParam.value : null;

    if (obj.name !== 'Start' && obj.name !== 'Count') {
      // Update value
      oldArr[index].value = newArrVal;
    }
  });

  return oldArr;
};

const createChartObj = localState => {
  const { chartType, dataset, mappedParams, params: orginalParams } = localState;
  let { options } = localState;
  const { groupBy, horizontal, stacked } = options;

  // Merge arrays to get a complete list of changes
  const params = mergeArrays(orginalParams, mappedParams);

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
  const { id, params = [], sourceName, type, ...chartKeys } = charts[chartIndex];

  // Show only certain params
  const paramsArr = params.filter(({ name }) => name !== 'Start' && name !== 'Count');
  const paramWithValueArr = paramsArr.filter(({ value }) => value != null && value !== '');

  let mappedParams;

  if (paramWithValueArr.length > 0) {
    mappedParams = paramWithValueArr;
  } else {
    mappedParams = [{ name: '', value: '' }];
  }

  // Create initial state object
  let initState = {
    chartID: id,
    chartType: type,
    dataObj: { loading: false },
    datasets: [],
    keyword: sourceName,
    mappedParams,
    params,
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
        newOptions.checkboxValueField = newOptions.name;
        newOptions.fields = [newOptions.name, newOptions.value];
      }

      delete newOptions.name;
      delete newOptions.value;

      break;
    case 'table':
      if (newType === 'bar' || newType === 'line') {
        newOptions.xAxis = newOptions.checkboxValueField;
        newOptions.yAxis = newOptions.fields[1] || '';
      } else if (newType === 'pie') {
        newOptions.name = newOptions.checkboxValueField;
        newOptions.value = newOptions.fields[1] || '';
      }

      delete newOptions.checkboxValueField;
      delete newOptions.fields;

      break;
    default:
      if (newType === 'pie') {
        newOptions.name = newOptions.xAxis;
        newOptions.value = newOptions.yAxis;

        delete newOptions.xAxis;
        delete newOptions.yAxis;
      } else if (newType === 'table') {
        newOptions.checkboxValueField = newOptions.xAxis;
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
