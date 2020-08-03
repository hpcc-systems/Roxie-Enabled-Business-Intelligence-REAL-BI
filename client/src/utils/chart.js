import axios from 'axios';
import errHandler from './errHandler';

// Constants
import { hasGroupByOption, hasHorizontalOption, hasStackedOption, hasDynamicOption } from '../utils/misc';

const getChartData = async (chartID, clusterID) => {
  let response;

  try {
    response = await axios.get('/api/source/data/multiple', { params: { chartID, clusterID } });
  } catch (err) {
    const { errMsg, status } = errHandler(err);

    if (status === 401) {
      return errMsg;
    }

    return {};
  }

  return response.data;
};

const getPreviewData = async (clusterID, dataOptions, sourceType) => {
  let response;

  try {
    response = await axios.get('/api/source/editordata', { params: { clusterID, dataOptions, sourceType } });
  } catch (err) {
    const { errMsg, status } = errHandler(err);

    if (status === 401) {
      return errMsg;
    }

    return {};
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

const createTextBoxObj = localState => {
  const { chartType, dataset } = localState;
  let { config } = localState;

  return { dataset, config, type: chartType };
};

const createChartObj = localState => {
  const { chartType, dataset, mappedParams, params: orginalParams } = localState;
  let { config } = localState;
  const { groupBy, horizontal, stacked } = config;

  // Merge arrays to get a complete list of changes
  const params = mergeArrays(orginalParams, mappedParams);

  // Change horizontal value if it doesn't apply to the chart type or is missing
  if ((!hasHorizontalOption(chartType) && horizontal) || !('horizontal' in config)) {
    config = { ...config, horizontal: false };
  }

  // Change stacked value if it doesn't apply to the chart type or is missing
  if ((!hasStackedOption(chartType) && stacked) || !('stacked' in config)) {
    config = { ...config, stacked: false };
  }

  // Change groupBy value if it doesn't apply to the chart type or is missing
  if ((!hasGroupByOption(chartType) && groupBy) || !('groupBy' in config)) {
    config = { ...config, groupBy: '' };
  }

  return { dataset, config, params, type: chartType };
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
    error: '',
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

const changeChartType = (oldType, newType, config) => {
  let newConfig = { ...config };

  //  Update values in config object to reflect the current chart type
  switch (oldType) {
    case 'pie':
      if (newType === 'bar' || newType === 'line' || newType === 'heatmap') {
        newConfig.xAxis = newConfig.name;
        newConfig.yAxis = newConfig.value;
      } else if (newType === 'table') {
        newConfig.checkboxValueField = newConfig.name;
        newConfig.fields = [newConfig.name, newConfig.value];
      }

      delete newConfig.name;
      delete newConfig.value;

      break;
    case 'table':
      if (newType === 'bar' || newType === 'line' || newType === 'heatmap') {
        newConfig.xAxis = newConfig.checkboxValueField;
        newConfig.yAxis = newConfig.fields ? newConfig.fields[1] : '';
      } else if (newType === 'pie') {
        newConfig.name = newConfig.checkboxValueField;
        newConfig.value = newConfig.fields ? newConfig.fields[1] : '';
      }

      delete newConfig.checkboxValueField;
      delete newConfig.fields;

      break;
    case 'textBox':
      delete newConfig.textBoxContent;
      delete newConfig.dataFields;

      break;
    default:
      if (newType === 'pie') {
        newConfig.name = newConfig.xAxis;
        newConfig.value = newConfig.yAxis;

        delete newConfig.xAxis;
        delete newConfig.yAxis;
      } else if (newType === 'table') {
        newConfig.checkboxValueField = newConfig.xAxis;
        newConfig.fields = [newConfig.xAxis, newConfig.yAxis];

        delete newConfig.xAxis;
        delete newConfig.yAxis;
      }

      if (oldType === 'heatmap') {
        delete newConfig.colorField;
      }
  }

  // Change horizontal value if it doesn't apply to the chart type or is missing
  if ((!hasHorizontalOption(newType) && newConfig.horizontal) || !('horizontal' in newConfig)) {
    newConfig = { ...newConfig, horizontal: false };
  }

  // Change stacked value if it doesn't apply to the chart type or is missing
  if ((!hasStackedOption(newType) && newConfig.stacked) || !('stacked' in newConfig)) {
    newConfig = { ...newConfig, stacked: false };
  }

  // Change groupBy value if it doesn't apply to the chart type or is missing
  if ((!hasGroupByOption(newType) && newConfig.groupBy) || !('groupBy' in newConfig)) {
    newConfig = { ...newConfig, groupBy: '' };
  }

  // Change static value if it doesn't apply to the chart type or is missing
  if ((!hasDynamicOption(newType) && newConfig.isStatic) || !('isStatic' in newConfig)) {
    newConfig = { ...newConfig, isStatic: false };
  }

  return newConfig;
};

export {
  changeChartType,
  checkForChartParams,
  createChartObj,
  createTextBoxObj,
  getChartData,
  getPreviewData,
  setEditorState,
};
