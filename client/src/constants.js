export const tokenName = 'realBI';

export const initUserObj = { id: null, directory: [], directoryDepth: [], lastDashboard: null };

// Convert a number to a string with a thousands place separator
export const thousandsSeparator = num => `${num}`.replace(/\d{1,3}(?=(\d{3})+$)/g, s => `${s},`);

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
  const chartTypes = ['bar', 'line'];

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
