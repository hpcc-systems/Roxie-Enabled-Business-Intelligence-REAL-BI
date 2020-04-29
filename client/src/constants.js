const initUserObj = { id: null, directory: [], directoryDepth: [], lastDashboard: null };

// Convert a number to a string with a thousands place separator
const thousandsSeparator = num => `${num}`.replace(/\d{1,3}(?=(\d{3})+$)/g, s => `${s},`);

// Determines if the chart type has a horizontal option
const hasHorizontalOption = chartType => {
  const chartTypes = ['bar', 'range'];

  if (chartTypes.indexOf(chartType) > -1) {
    return true;
  }

  return false;
};

const hasStackedOption = chartType => {
  const chartTypes = ['bar'];

  if (chartTypes.indexOf(chartType) > -1) {
    return true;
  }

  return false;
};

const hasGroupByOption = chartType => {
  const chartTypes = ['pie'];

  if (chartTypes.indexOf(chartType) === -1) {
    return true;
  }

  return false;
};

export { hasGroupByOption, hasHorizontalOption, hasStackedOption, initUserObj, thousandsSeparator };
