const { chart: Chart, source: Source, source_type: SourceType } = require('../models');
const { unNestSequelizeObj, removeFields } = require('./sequelize');

const getChartByID = async id => {
  let chart = await Chart.findOne({
    ...removeFields(['dashboardID', 'sourceID']),
    where: { id },
    include: {
      model: Source,
      as: 'source',
      ...removeFields(['typeID']),
      include: {
        model: SourceType,
        as: 'type',
        attributes: ['name'],
      },
    },
  });
  chart = unNestSequelizeObj(chart);
  chart.source = unNestSequelizeObj(chart.source);
  chart.source.type = chart.source.type.name;

  return chart;
};

const getChartsByDashboardID = async dashboardID => {
  let charts = await Chart.findAll({ where: { dashboardID }, paranoid: false });
  charts = charts.map(chart => unNestSequelizeObj(chart));

  return charts;
};

const createChart = async (chart, dashboardID, sourceID, sort) => {
  let newChart = await Chart.create({ configuration: { ...chart, sort }, dashboardID, sourceID });
  newChart = unNestSequelizeObj(newChart);

  return newChart;
};

const updateChartByID = async (chart, sourceID) => {
  const { id, configuration } = chart;
  return await Chart.update({ configuration, sourceID }, { where: { id } });
};

const deleteChartByID = async id => {
  return await Chart.destroy({ where: { id } });
};

module.exports = { createChart, deleteChartByID, getChartByID, getChartsByDashboardID, updateChartByID };
