import axios from 'axios';
import errHandler from './errHandler';

// Constants
import { hasGroupByOption, hasHorizontalOption, hasStackedOption, hasDynamicOption } from '../utils/misc';

export const getChartData = async (chartID, clusterID) => {
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

export const getPreviewData = async (clusterID, dataOptions, sourceType) => {
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

    if (matchedParam && obj.name !== 'Start' && obj.name !== 'Count') {
      // Update value
      oldArr[index].value = matchedParam.value;
    }
  });

  return oldArr;
};

export const createChartObj = (localState, ecl) => {
  const { config, dataset, mappedParams, sourceType } = localState;
  const { groupBy, horizontal, params = [], stacked, type } = config;
  let newConfig = { ...config, dataset };

  // Merge param arrays to send to server
  newConfig.params = mergeArrays(params, mappedParams);

  // Change horizontal value if it doesn't apply to the chart type or is missing
  if ((!hasHorizontalOption(type) && horizontal) || !('horizontal' in newConfig)) {
    newConfig = { ...newConfig, horizontal: false };
  }

  // Change stacked value if it doesn't apply to the chart type or is missing
  if ((!hasStackedOption(type) && stacked) || !('stacked' in newConfig)) {
    newConfig = { ...newConfig, stacked: false };
  }

  // Change groupBy value if it doesn't apply to the chart type or is missing
  if ((!hasGroupByOption(type) && groupBy) || !('groupBy' in newConfig)) {
    newConfig = { ...newConfig, groupBy: '' };
  }

  // Move ecl values to config object root
  if (sourceType === 'ecl') {
    const newDataset = !ecl.dataset ? dataset : ecl.dataset;
    const newParams = !ecl.params ? params : ecl.params;

    newConfig = { ...newConfig, dataset: newDataset, params: newParams };

    delete ecl.data;
    delete ecl.dataset;
    delete ecl.params;
  }

  return { ...newConfig, ecl };
};

export const setEditorState = (charts, chartID) => {
  // Get desired chart
  const chartIndex = charts.map(({ id }) => id).indexOf(chartID);
  const { config, id, sourceName, sourceType, ...chartKeys } = charts[chartIndex];
  const { axis1, axis2, dataset, ecl = {}, params = [] } = config;

  // // Show only certain params
  const paramsArr = params.filter(({ name }) => name !== 'Start' && name !== 'Count');
  const paramWithValueArr = paramsArr.filter(({ value }) => value != null && value !== '');

  let mappedParams;

  if (sourceType === 'file' && paramWithValueArr.length > 0) {
    mappedParams = paramWithValueArr;
  } else {
    mappedParams = [{ name: '', value: '' }];
  }

  // Confirm values are present to prevent error
  config.axis1.showTickLabels = !('showTickLabels' in axis1) ? true : axis1.showTickLabels;
  config.axis2.showTickLabels = !('showTickLabels' in axis2) ? true : axis2.showTickLabels;

  // Create initial state object
  let initState = {
    chartID: id,
    config,
    dataObj: { loading: false },
    dataset,
    datasets: [],
    error: '',
    keyword: sourceName,
    mappedParams,
    selectedDataset: {},
    selectedSource: {},
    sources: [],
    sourceType,
    ...chartKeys,
  };

  return { initState, eclObj: ecl };
};

export const checkForChartParams = chartsArr => {
  let exists = false;

  // use for-loop to allow for "break"
  for (let i = 0; i < chartsArr.length; i++) {
    const { params = [] } = chartsArr[i].config;

    const hasParamValue = params.some(({ value }) => value !== null && value !== '');

    if (hasParamValue) {
      exists = true;
      break;
    }
  }

  return exists;
};

export const changeChartType = (oldType, newType, config) => {
  let newConfig = { ...config, type: newType };
  const { axis1 = {}, axis2 = {} } = newConfig;

  //  Update values in config object to reflect the current chart type
  switch (oldType) {
    case 'pie':
      if (newType === 'table' && axis1.value && axis2.value) {
        newConfig.checkboxValueField = axis1.value;
        newConfig.fields = [axis1.value, axis2.value];
      }

      break;
    case 'table':
      newConfig.axis1 = { label: axis1.label || '', value: newConfig.checkboxValueField };
      newConfig.axis2 = { label: axis2.label || '', value: newConfig.fields ? newConfig.fields[1] : '' };

      delete newConfig.checkboxValueField;
      delete newConfig.fields;

      break;
    case 'textBox':
      delete newConfig.textBoxContent;
      delete newConfig.dataFields;

      break;
    default:
      if (newType === 'table' && axis1.value && axis2.value) {
        newConfig.checkboxValueField = axis1.value || '';
        newConfig.fields = [axis1.value, axis2.value];
      }

      delete newConfig.colorField;

      break;
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
