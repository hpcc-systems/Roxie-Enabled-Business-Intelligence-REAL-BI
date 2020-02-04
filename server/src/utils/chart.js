const { chart: chartModel } = require('../models');

const getChartsByDashboard = async dashboardID => {
  let charts;

  try {
    charts = await chartModel.findAll({ where: { dashboardID } });
  } catch (err) {
    return err;
  }

  return charts;
};

module.exports = { getChartsByDashboard };
