import axios from 'axios';

export const createFilterObj = (localState, ecl) => {
  const { filterType, minDate, maxDate, name, sourceDataset, sourceField, sourceType, params } = localState;

  // Get array of objects that are complete
  const completeParams = params.filter(({ targetChart, targetParam }) => {
    return targetChart !== '' && targetParam !== '';
  });

  const newFilter = {
    dataset: sourceDataset,
    field: sourceField,
    name,
    params: completeParams,
    type: filterType,
  };

  if (filterType === 'dateRange') {
    newFilter.minDate = minDate;
    newFilter.maxDate = maxDate;
  } else {
    delete newFilter.minDate;
    delete newFilter.maxDate;
  }

  // Move ecl value to object root
  if (sourceType === 'ecl') {
    newFilter.dataset = ecl.dataset ? ecl.dataset : newFilter.dataset;

    delete ecl.data;
    delete ecl.dataset;
  }

  return { ...newFilter, ecl };
};

export const getFilterData = async (clusterID, filterID) => {
  try {
    const response = await axios.get('/api/v1/dashboard_filter/data', {
      params: { clusterID, filterID },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getFilterValue = (valueObj, type) => {
  if (!valueObj || !valueObj.value) {
    if (type === 'dateField') {
      return '';
    }

    return [];
  }

  const { dataType, value } = valueObj;
  let convertedValue;

  switch (dataType) {
    case 'number':
      convertedValue = Number(value);
      break;
    case 'boolean':
      convertedValue = Boolean(value);
      break;
    case 'string':
    default:
      convertedValue = String(value).split(',').sort();
  }

  return convertedValue;
};

export const getFilterValueType = value => {
  if (!value) return null;

  // eslint-disable-next-line eqeqeq
  return isNaN(value) === false ? 'number' : value == true || value == false ? 'boolean' : 'string';
};
