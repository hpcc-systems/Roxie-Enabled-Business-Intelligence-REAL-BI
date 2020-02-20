const { chart: chartModel } = require('../models');

const getChartsByDashboard = async dashboardID => {
  let charts;

  try {
    charts = await chartModel.findAll({ where: { dashboardID } });
  } catch (err) {
    throw err;
  }

  charts.forEach(({ fields }, index) => {
    // Convert string to array
    fields = fields.split(';');

    // Update chart
    charts[index].fields = fields;
  });

  return charts;
};

const createChart = async chart => {
  const { fields } = chart;
  let newChart;

  // Convert array to string
  chart.fields = fields.sort().join(';');

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

  // Un-nest object
  chart = chart.dataValues;

  // Convert string to array
  const { fields } = chart;
  chart.fields = fields.split(';');

  return chart;
};

const updateChartByID = async chart => {
  const { id, ...chartFields } = chart;
  let { fields } = chart;

  // Convert array to string
  fields = fields.sort().join(';');

  try {
    await chartModel.update({ ...chartFields, fields }, { where: { id } });
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
