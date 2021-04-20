import axios from 'axios';
import _orderBy from 'lodash/orderBy';

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

export const createChartObj = (localState, ecl) => {
  const { configuration, dataset, params = [], selectedDataset, sourceType } = localState;
  let formattedParams = params.map(obj => {
    delete obj.show;
    return obj;
  });

  let newConfig = validateConfigOptions({ ...configuration, dataset });
  newConfig.params = formattedParams;

  // Move ecl values to configuration object root
  if (sourceType === 'ecl') {
    const newDataset = !ecl.dataset ? dataset : ecl.dataset;

    newConfig = { ...newConfig, dataset: newDataset };

    delete ecl.data;
    delete ecl.dataset;
  }

  if (configuration.type === 'table' && sourceType !== 'ecl') {
    // Removes any fields that are no longer options in the selected dataset
    const validFields = selectedDataset.fields.map(({ name }) => name);
    newConfig.fields = newConfig.fields.filter(({ name }) => validFields.indexOf(name) > -1 && name !== '');
  }

  if (configuration.type === 'map') {
    newConfig.mapFields = newConfig.mapFields.filter(({ name }) => name !== '');
  }

  return { ...newConfig, ecl };
};

export const setEditorState = (charts, chartID) => {
  // Get desired chart
  const chartIndex = charts.map(({ id }) => id).indexOf(chartID);
  const { configuration, id, source, ...chartKeys } = charts[chartIndex];
  const {
    axis1,
    axis2,
    conditionals = [],
    dataset,
    ecl = {},
    fields = [],
    mapFields = [],
    params,
  } = configuration;

  // Confirm values are present to prevent error
  configuration.axis1.showTickLabels = !('showTickLabels' in axis1) ? true : axis1.showTickLabels;
  configuration.axis2.showTickLabels = !('showTickLabels' in axis2) ? true : axis2.showTickLabels;

  if (conditionals.length === 0 && fields.length > 0) {
    configuration.conditionals = fields.map(({ name }) => ({
      field: name,
      rules: [{ operand: '>', value: '', color: '#FFF' }],
    }));
  }

  // Create initial state object
  let initState = {
    chartID: id,
    configuration: {
      ...configuration,
      fields: [...fields, { color: '#FFF', label: '', name: '' }],
      mapFields: [...mapFields, { label: '', name: '' }],
    },
    dataObj: { loading: false },
    dataset,
    datasets: [],
    error: '',
    errors: [],
    keyword: source?.name,
    params,
    selectedDataset: {},
    selectedSource: {},
    sources: [],
    sourceType: source?.type,
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

export const evaluateFormattingRules = (value, color, textColor, rules) => {
  let styleObj = { backgroundColor: color, color: textColor };

  if (rules.length > 0) {
    const greaterThanRules = rules.filter(({ operand, value }) => value !== '' && operand.indexOf('>') > -1);
    const lessThanRules = rules.filter(({ operand, value }) => value !== '' && operand.indexOf('<') > -1);
    const equalRules = rules.filter(({ operand, value }) => value !== '' && operand === '==');
    styleObj = { backgroundColor: '#FFF', color: '#000' };

    for (const rule of _orderBy(greaterThanRules, ['value'], ['asc'])) {
      const { operand, value: ruleVal, color = '#FFF', text: textColor = '#000' } = rule;

      switch (operand) {
        case '>=':
          if (value >= ruleVal) {
            styleObj = { backgroundColor: color, color: textColor };
          }
          break;
        default:
          if (value > ruleVal) {
            styleObj = { backgroundColor: color, color: textColor };
          }
      }
    }

    for (const rule of _orderBy(lessThanRules, ['value'], ['desc'])) {
      const { operand, value: ruleVal, color = '#FFF', text: textColor = '#000' } = rule;

      switch (operand) {
        case '<=':
          if (value <= ruleVal) {
            styleObj = { backgroundColor: color, color: textColor };
          }
          break;
        default:
          if (value < ruleVal) {
            styleObj = { backgroundColor: color, color: textColor };
          }
      }
    }

    for (const rule of _orderBy(equalRules, ['value'], ['asc'])) {
      const { value: ruleVal, color = '#FFF', text: textColor = '#000' } = rule;

      if (value == ruleVal) {
        styleObj = { backgroundColor: color, color: textColor };
      }
    }
  }

  return styleObj;
};
