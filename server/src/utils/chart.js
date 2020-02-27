const { chart: chartModel } = require('../models');
const { setJSONField } = require('./misc');

const getChartsByDashboard = async dashboardID => {
  let charts;

  try {
    charts = await chartModel.findAll({ where: { dashboardID } });
  } catch (err) {
    throw err;
  }

  // Iterate through array of charts
  charts = charts.map(chart => {
    // Format data structure
    chart.params = setJSONField(chart, 'params');
    chart.options = setJSONField(chart, 'options');

    return chart;
  });

  return charts;
};

const createChart = async chart => {
  let newChart;

  try {
    newChart = await chartModel.create(chart);
  } catch (err) {
    throw err;
  }

  return newChart.dataValues;
};

const getChartByID = async chartID => {
  let chart;

  try {
    chart = await chartModel.findOne({ where: { id: chartID } });
  } catch (err) {
    throw err;
  }

  // De-nest data
  chart = chart.dataValues;

  // Format data structure
  chart.params = setJSONField(chart, 'params');
  chart.options = setJSONField(chart, 'options');

  return chart;
};

const updateChartByID = async chart => {
  const { id, ...chartFields } = chart;

  try {
    await chartModel.update({ ...chartFields }, { where: { id } });
  } catch (err) {
    throw err;
  }

  return;
};

const deleteChartByID = async chartID => {
  try {
    await chartModel.destroy({ where: { id: chartID } });
  } catch (err) {
    throw err;
  }

  return;
};

module.exports = {
  createChart,
  deleteChartByID,
  getChartByID,
  getChartsByDashboard,
  updateChartByID,
};
