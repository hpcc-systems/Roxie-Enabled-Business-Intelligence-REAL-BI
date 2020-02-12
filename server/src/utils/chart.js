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
  let newChart;

  try {
    newChart = await chartModel.create(chart);
  } catch (err) {
    return err;
  }

  return newChart.dataValues;
};

const getChartByID = async chartID => {
  let chart;

  try {
    chart = await chartModel.findOne({ where: { id: chartID } });
  } catch (err) {
    return err;
  }

  return chart.dataValues;
};

const updateChartByID = async chart => {
  const { id, ...chartFields } = chart;

  try {
    await chartModel.update({ ...chartFields }, { where: { id } });
  } catch (err) {
    return err;
  }

  return;
};

const deleteChartByID = async chartID => {
  try {
    await chartModel.destroy({ where: { id: chartID } });
  } catch (err) {
    return err;
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
