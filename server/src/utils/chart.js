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

const createChart = async chart => {
  try {
    await chartModel.create(chart);
  } catch (err) {
    return err;
  }

  return;
};

module.exports = { createChart, getChartsByDashboard };
