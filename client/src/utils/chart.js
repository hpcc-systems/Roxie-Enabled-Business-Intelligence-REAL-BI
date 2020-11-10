import axios from 'axios';

// Constants
import {
  hasGroupByOption,
  hasHorizontalOption,
  hasStackedOption,
  hasDynamicOption,
  hasSortOptions,
} from '../utils/misc';

export const getChartData = async (chartID, clusterID, dashboardID, interactiveObj) => {
  try {
    const response = await axios.get('/api/v1/chart/data', {
      params: { chartID, clusterID, dashboardID, interactiveObj },
    });
    return response.data;
  } catch (err) {
    throw err.response.data;
  }
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
  const { configuration, dataset, mappedParams, sourceType } = localState;
  const { params = [] } = configuration;
  let newConfig = { ...configuration, dataset };

  // Merge param arrays to send to server
  newConfig.params = mergeArrays(params, mappedParams);

  newConfig = validateConfigOptions(newConfig);

  // Move ecl values to configuration object root
  if (sourceType === 'ecl') {
    const newDataset = !ecl.dataset ? dataset : ecl.dataset;
    const newParams = !ecl.params ? params : [...ecl.params, ...params];

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
  const { configuration, id, source, ...chartKeys } = charts[chartIndex];
  const { axis1, axis2, dataset, ecl = {}, params = [] } = configuration;

  // // Show only certain params
  const paramsArr = params.filter(({ name }) => name !== 'Start' && name !== 'Count');
  const paramWithValueArr = paramsArr.filter(({ value }) => value != null && value !== '');

  let mappedParams;

  if (source.type === 'file' && paramWithValueArr.length > 0) {
    mappedParams = paramWithValueArr;
  } else {
    mappedParams = [{ name: '', value: '' }];
  }

  // Confirm values are present to prevent error
  configuration.axis1.showTickLabels = !('showTickLabels' in axis1) ? true : axis1.showTickLabels;
  configuration.axis2.showTickLabels = !('showTickLabels' in axis2) ? true : axis2.showTickLabels;

  // Create initial state object
  let initState = {
    chartID: id,
    configuration,
    dataObj: { loading: false },
    dataset,
    datasets: [],
    error: '',
    errors: [],
    keyword: source.name,
    mappedParams,
    selectedDataset: {},
    selectedSource: {},
    sources: [],
    sourceType: source.type,
    ...chartKeys,
  };

  return { initState, eclObj: ecl };
};

export const checkForChartParams = chartsArr => {
  let exists = false;

  // use for-loop to allow for "break"
  for (let i = 0; i < chartsArr.length; i++) {
    const { params = [] } = chartsArr[i].configuration;

    const hasParamValue = params.some(({ value }) => value !== null && value !== '');

    if (hasParamValue) {
      exists = true;
      break;
    }
  }

  return exists;
};

export const changeChartType = (oldType, newType, configuration) => {
  let newConfig = { ...configuration, type: newType };
  const { axis1 = {}, axis2 = {} } = newConfig;

  //  Update values in configuration object to reflect the current chart type
  switch (oldType) {
    case 'pie':
      if (newType === 'table' && axis1.value && axis2.value) {
        newConfig.fields = [axis1.value, axis2.value];
      }

      break;
    case 'table':
      newConfig.axis1 = { label: axis1.label || '', value: newConfig.fields ? newConfig.fields[0] : '' };
      newConfig.axis2 = { label: axis2.label || '', value: newConfig.fields ? newConfig.fields[1] : '' };

      delete newConfig.fields;

      break;
    case 'textBox':
      delete newConfig.textBoxContent;
      delete newConfig.dataFields;

      break;
    default:
      if (newType === 'table' && axis1.value && axis2.value) {
        newConfig.fields = [axis1.value, axis2.value];
      }

      delete newConfig.colorField;

      break;
  }

  newConfig = validateConfigOptions(newConfig);

  return newConfig;
};

const validateConfigOptions = newConfig => {
  const { groupBy = {}, horizontal, isStatic, sortBy = {}, stacked, type } = newConfig;

  // Change horizontal value if it doesn't apply to the chart type or is missing
  if ((!hasHorizontalOption(type) && horizontal) || !('horizontal' in newConfig)) {
    newConfig = { ...newConfig, horizontal: false };
  }

  // Change stacked value if it doesn't apply to the chart type or is missing
  if ((!hasStackedOption(type) && stacked) || !('stacked' in newConfig)) {
    newConfig = { ...newConfig, stacked: false };
  }

  // Change groupBy value if it doesn't apply to the chart type or is missing
  if ((!hasGroupByOption(type) && groupBy.value) || !('groupBy' in newConfig)) {
    newConfig = { ...newConfig, groupBy: {} };
  }

  // Change sortBy value if it doesn't apply to the chart type or is missing
  if ((!hasSortOptions(type) && sortBy.value) || !('sortBy' in newConfig)) {
    newConfig = { ...newConfig, sortBy: {} };
  }

  // Change static value if it doesn't apply to the chart type or is missing
  if ((!hasDynamicOption(type) && isStatic) || !('isStatic' in newConfig)) {
    newConfig = { ...newConfig, isStatic: false };
  }

  return newConfig;
};
