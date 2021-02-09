import moment from 'moment';

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

export const canAddCharts = permission => {
  const permissions = ['Owner'];

  // Return boolean
  return permissions.indexOf(permission) > -1;
};

export const canEditCharts = permission => {
  const permissions = ['Owner'];

  // Return boolean
  return permissions.indexOf(permission) > -1;
};

export const canDeleteCharts = permission => {
  const permissions = ['Owner'];

  // Return boolean
  return permissions.indexOf(permission) > -1;
};

export const canShareDashboard = permission => {
  const permissions = ['Owner'];

  // Return boolean
  return permissions.indexOf(permission) > -1;
};

export const canReOrganizeDashboards = permission => {
  const permissions = ['Owner'];

  // Return boolean
  return permissions.indexOf(permission) > -1;
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

export const formatValue = (type, value, returnDate = false) => {
  if (type === 'date') {
    return returnDate ? new Date(String(value)) : moment(String(value)).format('L');
  } else if (type === 'datetime') {
    return returnDate ? new Date(String(value)) : moment(String(value)).format('LT');
  }

  return type === 'number' ? Number(value) : String(value);
};

export const getDateParts = date => {
  // Expects date string in mm/dd/yyyy format

  if (!date || typeof date !== 'string' || date.length !== 10) {
    return;
  }

  const month = date.substring(0, 2);
  const day = date.substring(3, 5);
  const year = date.substring(6, 10);

  return { month, day, year };
};
