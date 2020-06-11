// DB Models
const { dashboard: dashboardModel, source: sourceModel } = require('../models');

// Utils
const { awaitHandler, unNestSequelizeObj } = require('./misc');

const createSource = async source => {
  let [err, newSource] = await awaitHandler(sourceModel.create(source));

  // Return error
  if (err) throw err;

  // Get nested object
  newSource = unNestSequelizeObj(newSource);

  return newSource;
};

const getSourcesByDashboard = async dashboardID => {
  let [err, sources] = await awaitHandler(
    sourceModel.findAll({
      include: { model: dashboardModel, attributes: [], where: { id: dashboardID } },
    }),
  );

  // Return error
  if (err) throw err;

  return sources;
};

const getSourceByHpccID = async ({ hpccID }) => {
  let [err, source] = await awaitHandler(sourceModel.findOne({ where: { hpccID } }));

  // Return error
  if (err) throw err;

  // Get nested object
  source = unNestSequelizeObj(source);

  return source;
};

const getSourceByID = async sourceID => {
  let [err, source] = await awaitHandler(sourceModel.findOne({ where: { id: sourceID } }));

  // Return error
  if (err) throw err;

  // Get nested object
  source = unNestSequelizeObj(source);

  return source;
};

const getSourcesByDashboardID = async dashboardID => {
  let [err, dashboard] = await awaitHandler(
    dashboardModel.findOne({
      attributes: [],
      where: { id: dashboardID },
      include: { model: sourceModel },
    }),
  );

  // Return error
  if (err) throw err;

  // Get nested objects
  dashboard = unNestSequelizeObj(dashboard);
  let sources = dashboard.sources.map(source => {
    // Get nested object
    source = unNestSequelizeObj(source);

    // Remove unnecessay key
    delete source.dashboardSource;

    return source;
  });

  return sources;
};

const deleteSourceByID = async sourceID => {
  let [err] = await awaitHandler(sourceModel.destroy({ where: { id: sourceID } }));

  // Return error
  if (err) throw err;

  return;
};

module.exports = {
  createSource,
  deleteSourceByID,
  getSourcesByDashboard,
  getSourcesByDashboardID,
  getSourceByHpccID,
  getSourceByID,
};
