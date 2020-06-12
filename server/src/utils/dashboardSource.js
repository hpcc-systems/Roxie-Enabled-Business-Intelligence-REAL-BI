// DB Models
const { dashboardSource: dashboardSourceModel } = require('../models');

// Utils
const { awaitHandler, unNestSequelizeObj } = require('./misc');

const createDashboardSource = async (dashboardID, sourceID) => {
  let [err, dashboardSource] = await awaitHandler(dashboardSourceModel.create({ dashboardID, sourceID }));

  // Return error
  if (err) throw err;

  // Get nested object
  dashboardSource = unNestSequelizeObj(dashboardSource);

  return dashboardSource;
};

const getDashboardSource = async (dashboardID, sourceID) => {
  let [err, dashboardSource] = await awaitHandler(
    dashboardSourceModel.findOne({ where: { dashboardID, sourceID } }),
  );

  // Return error
  if (err) throw err;

  // Get nested object
  dashboardSource = unNestSequelizeObj(dashboardSource);

  return dashboardSource;
};

const deleteDashboardSource = async (dashboardID, sourceID) => {
  let [err] = await awaitHandler(dashboardSourceModel.destroy({ where: { dashboardID, sourceID } }));

  // Return error
  if (err) throw err;

  return;
};

module.exports = { createDashboardSource, deleteDashboardSource, getDashboardSource };
