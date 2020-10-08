import moment from 'moment';

export const sortArr = (arr, field = '', order = 'asc') => {
  if (!field) return arr;

  arr.sort((a, b) => {
    let aField = a[field] == null ? '' : a[field];
    let bField = b[field] == null ? '' : b[field];

    // Format value
    aField = isNaN(Number(aField)) ? aField.trim().toLowerCase() : Number(aField);
    bField = isNaN(Number(bField)) ? bField.trim().toLowerCase() : Number(bField);

    // Sort value
    let value = 0;

    if (aField < bField) {
      value = -1;
    } else if (aField > bField) {
      value = 1;
    } else {
      value = 0;
    }

    if (order === 'desc' && value !== 0) {
      value = -value;
    }

    return value;
  });

  return arr;
};

export const checkForNumber = value => {
  // Convert value to NaN or convert to number
  const num = value == null && value !== 0 ? NaN : Number(value);

  // Value is not a number, return the original value
  if (isNaN(num)) {
    return value;
  }

  // Return the converted number
  return num;
};

// Convert a number to a string with a thousands place separator
export const thousandsSeparator = num => {
  // Number contains a decimal
  if (num % 1 > 0) {
    return `${num}`;
  }

  return `${num}`.replace(/\d{1,3}(?=(\d{3})+$)/g, s => `${s},`);
};

// Determines if the chart type has a horizontal option
export const hasHorizontalOption = chartType => {
  const chartTypes = ['bar'];

  // Return boolean
  return chartTypes.indexOf(chartType) > -1;
};

// Determines if the chart type has a stacked option
export const hasStackedOption = chartType => {
  const chartTypes = ['bar'];

  // Return boolean
  return chartTypes.indexOf(chartType) > -1;
};

export const hasGroupByOption = chartType => {
  const chartTypes = ['bar', 'line', 'scatter'];

  // Return boolean
  return chartTypes.indexOf(chartType) > -1;
};

export const hasDynamicOption = chartType => {
  const chartTypes = ['textBox'];

  // Return boolean
  return chartTypes.indexOf(chartType) > -1;
};

export const hasSortOptions = chartType => {
  const chartTypes = ['bar', 'dualline', 'heatmap', 'line', 'scatter'];

  // Return boolean
  return chartTypes.indexOf(chartType) > -1;
};

export const hasDataLabelOption = chartType => {
  const chartTypes = ['bar', 'dualline', 'heatmap', 'line', 'pie', 'scatter'];

  // Return boolean
  return chartTypes.indexOf(chartType) > -1;
};

export const hasClickEventOption = chartType => {
  const chartTypes = ['bar', 'donut', 'line', 'table'];

  // Return boolean
  return chartTypes.indexOf(chartType) > -1;
};

export const canAddCharts = role => {
  const roles = ['Owner'];

  // Return boolean
  return roles.indexOf(role) > -1;
};

export const canEditCharts = role => {
  const roles = ['Owner'];

  // Return boolean
  return roles.indexOf(role) > -1;
};

export const canDeleteCharts = role => {
  const roles = ['Owner'];

  // Return boolean
  return roles.indexOf(role) > -1;
};

export const createDateTimeStamp = chartDesc => {
  // Create Time Stamp
  let datetimeStamp = moment().format('MM/DD/YYYY hh:mm:ss a');
  datetimeStamp = `Last Refreshed: ${datetimeStamp}`; // Format label in front of datetime stamp

  // Get user input description
  const newDesc = chartDesc ? chartDesc : '';

  if (newDesc) {
    // Append datetime stamp to description
    return `${newDesc}\n${datetimeStamp}`;
  }

  // No description, return the datetime stamp
  return datetimeStamp;
};

export const existsInArray = (arr, string) => {
  return arr.indexOf(string) > -1;
};

// Changes message based on source type
export const getMessage = (sourceType, isFilter = false) => {
  let message = 'Choose a dataset';

  if (sourceType === 'ecl') {
    message = 'Run ECL Script';
  } else if (sourceType === 'file') {
    message = isFilter ? 'Error retrieving file metadata' : 'Choose a file';
  }

  return message;
};
