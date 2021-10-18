import moment from 'moment';

// Determines if the chart type has a horizontal option
export const hasHorizontalOption = chartType => {
  const chartTypes = ['bar'];

  // Return boolean
  return chartTypes.indexOf(chartType) > -1;
};

// Determines if the chart type has a stacked option
export const hasStackedOption = chartType => {
  const chartTypes = ['bar', 'columnline'];

  // Return boolean
  return chartTypes.indexOf(chartType) > -1;
};

// Determines if the chart type has a percentage stack option
export const hasPercentageStackOption = chartType => {
  const chartTypes = ['bar', 'columnline'];

  // Return boolean
  return chartTypes.indexOf(chartType) > -1;
};

export const hasGroupByOption = chartType => {
  const chartTypes = ['bar', 'columnline', 'dualline', 'histogram', 'line', 'scatter'];

  // Return boolean
  return chartTypes.indexOf(chartType) > -1;
};

export const hasDynamicOption = chartType => {
  const chartTypes = ['textBox'];

  // Return boolean
  return chartTypes.indexOf(chartType) > -1;
};

export const hasSortOptions = chartType => {
  const chartTypes = ['bar', 'columnline', 'dualline', 'heatmap', 'line', 'scatter'];

  // Return boolean
  return chartTypes.indexOf(chartType) > -1;
};

export const hasDataLabelOption = chartType => {
  const chartTypes = ['bar', 'columnline', 'dualline', 'heatmap', 'histogram', 'line', 'pie', 'scatter'];

  // Return boolean
  return chartTypes.indexOf(chartType) > -1;
};

export const hasClickEventOption = chartType => {
  const chartTypes = ['bar', 'donut', 'line', 'pie', 'table'];

  // Return boolean
  return chartTypes.indexOf(chartType) > -1;
};

export const canAddCharts = permission => {
  const permissions = ['Owner'];

  // Return boolean
  return permissions.indexOf(permission) > -1;
};

export const canEditCharts = permission => permission === 'Owner';

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

// https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color
export function getConstrastTextColor(hex) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    return console.log('Invalid HEX color');
  }
  const r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);

  // http://stackoverflow.com/a/3943023/112731
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
}

export const createErrorMessage = error => {
  let message;
  if (error.payload) {
    message = error.payload.data.errors.reduce((acc, el) => {
      let elMessages = '';
      for (const key in el) {
        elMessages += el[key] + '. ';
      }
      return (acc += elMessages);
    }, '');
  } else {
    message = error.message;
  }

  return message;
};
