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

// https://convertingcolors.com/blog/article/convert_hex_to_rgb_with_javascript.html
const hexToRgb = hex => {
  if (hex.length !== 6 && hex.length !== 7) {
    return [255, 255, 255];
  }

  const hexVal = hex[0] === '#' ? hex.slice(1, hex.length) : hex;
  const rgbHex = hexVal.match(/.{1,2}/g);
  const rgbArr = [parseInt(rgbHex[0], 16), parseInt(rgbHex[1], 16), parseInt(rgbHex[2], 16)];

  return rgbArr;
};

// https://websolutionstuff.com/post/change-text-color-based-on-background-color-using-javascript
export const getConstrastTextColor = hex => {
  const backgroundColorRgb = hexToRgb(hex);

  const color = Math.round(
    (parseInt(backgroundColorRgb[0]) * 299 +
      parseInt(backgroundColorRgb[1]) * 587 +
      parseInt(backgroundColorRgb[2]) * 114) /
      1000,
  );

  return color > 125 ? 'black' : 'white';
};
