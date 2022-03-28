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

export const getChartData = async (chartID, clusterID, dashboardID, interactiveObj = {}) => {
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

  return { ...newConfig, ecl };
};

export const setEditorState = chart => {
  // Get desired chart
  const { configuration, id, source, data, loading, lastModifiedDate, ...chartKeys } = chart;
  const { axis1, axis2, conditionals = [], dataset, fields = [], params, isStatic, ecl = {} } = configuration;

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
    },
    ecl,
    dataObj: {
      data: {
        data,
        lastModifiedDate,
      },
      loading,
    },
    dataset,
    datasets: [],
    error: '',
    errors: [],
    keyword: source?.name,
    params,
    selectedDataset: { loading: isStatic ? false : true, name: '', fields: [] }, // setting initial state to loading true on editing chart dialog will prevent user to see empty fields, as data is not yet available
    selectedSource: {},
    sources: [],
    sourceType: source?.type,
    ...chartKeys,
  };
  // we have added ecl to main body, we dont need duplicate in config, they will be merged on save again
  delete initState.configuration.ecl;
  if (initState.configuration.mapFields) delete initState.configuration.mapFields; // this fields are not in use by any component, dead code.

  return initState;
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

export const changeChartType = (newType, configuration) => {
  let newConfig = {
    ...configuration,
    type: newType,
    fields: [{ color: '#FFF', label: '', name: '', asLink: false, linkBase: '' }], // reset fields value to default to avoid validations types confusions.
  };

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
  // dont understand logic, each data row has default rules, if rules are different then user provided rules, new styles applied
  // const defaultRule = [{ color: '#FFF', operand: '>', value: '' }];
  // if (_.isEqual(defaultRule, rules)) return styleObj;

  const greaterThanRules = rules.filter(({ operand, value }) => value !== '' && operand === '>');
  const lessThanRules = rules.filter(({ operand, value }) => value !== '' && operand === '<');
  const equalRules = rules.filter(({ operand, value }) => value !== '' && operand === '==');
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

  return styleObj;
};
