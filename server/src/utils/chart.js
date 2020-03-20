// DB Models
const { chart: chartModel, query: queryModel } = require('../models');

// Utils
const { unNestSequelizeObj } = require('./misc');

const getChartsByDashboardID = async dashboardID => {
  let charts;

  try {
    charts = await chartModel.findAll({
      attributes: { exclude: ['dashboardID'] },
      where: { dashboardID },
      include: [
        {
          model: queryModel,
          attributes: [['name', 'queryName']],
        },
      ],
    });
  } catch (err) {
    throw err;
  }

  // Create new array of flattened objects
  charts = charts.map(chart => {
    // Get nested objects
    chart = unNestSequelizeObj(chart);
    let { queryName } = unNestSequelizeObj(chart.query); // Equivalent of chart.query.dataValues.queryName

    // Create new chart object
    const newObj = { ...chart, queryName };

    // Remove original nested object
    delete newObj.query;

    return newObj;
  });

  return charts;
};

const createChart = async (chart, dashboardID, queryID) => {
  let newChart;

  try {
    newChart = await chartModel.create({ ...chart, dashboardID, queryID });
  } catch (err) {
    throw err;
  }

  // Get nested object
  newChart = unNestSequelizeObj(newChart);

  return newChart;
};

const getChartByID = async chartID => {
  let chart, query;

  try {
    chart = await chartModel.findOne({
      where: { id: chartID },
      include: { model: queryModel },
    });
  } catch (err) {
    throw err;
  }

  // Get nested objects
  chart = unNestSequelizeObj(chart);
  query = unNestSequelizeObj(chart.query);

  return { ...chart, query };
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
  getChartsByDashboardID,
  updateChartByID,
};
