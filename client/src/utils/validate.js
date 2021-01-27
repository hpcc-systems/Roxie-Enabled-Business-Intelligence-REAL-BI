import moment from 'moment';

export const validateSource = (state, eclRef) => {
  const { selectedDataset = {}, selectedSource = {}, sourceType } = state;
  const errors = [];

  switch (sourceType) {
    case 'ecl':
      if (!eclRef.current.schema) {
        errors.push({ eclRef: 'Enter and execute desired ECL' });
      }

      break;
    case 'file':
      if (!selectedSource.cluster) {
        errors.push({ selectedSource: 'Search for and select a logical file' });
      }

      break;
    case 'query':
    default:
      if (!selectedSource.cluster) {
        errors.push({ selectedSource: 'Search for and select a Roxie query' });
      }

      if (!selectedDataset.name) {
        errors.push({ selectedDataset: 'Select a dataset' });
      }

      break;
  }

  if (errors.length > 0) throw errors;
  return;
};

export const validateFilter = (state, eclRef) => {
  const { filterType, minDate, name, params, sourceField } = state;
  const errors = [];

  if (name === '') {
    errors.push({ name: 'Provide a name for this filter' });
  }

  if (!params[0].targetChart) {
    errors.push({ targetChart0: 'Specify at least one chart to be modified by this filter' });
  } else if (!params[0].targetParam) {
    errors.push({ targetParam0: 'Specify a parameter for the selected chart' });
  }

  params.forEach(({ targetChart, targetParam }, index) => {
    if (index > 0) {
      if (targetChart !== '' && targetParam === '') {
        errors.push({ [`targetParam${index}`]: 'Specify a parameter for the selected chart' });
      }
    }
  });

  if (filterType !== 'dateRange' && filterType !== 'dateField') {
    validateSource(state, eclRef);

    if (!sourceField) {
      errors.push({ sourceField: 'Select a field of values' });
    }
  } else {
    if (filterType !== 'dateField') {
      if (!params[0].dateRangePosition) {
        errors.push({ dateRangePosition0: 'Specify the date range position' });
      }

      params.forEach(({ dateRangePosition, targetChart, targetParam }, index) => {
        if (index > 0) {
          if ((targetChart !== '' || targetParam === '') && dateRangePosition === '') {
            errors.push({ [`dateRangePosition${index}`]: 'Specify the date range position' });
          }
        }
      });

      if (!minDate || !moment(minDate).isValid()) {
        errors.push({ minDate: 'Valid Date Required' });
      }
    }
  }

  if (errors.length > 0) throw errors;
  return;
};
