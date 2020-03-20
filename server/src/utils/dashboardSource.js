// DB Models
const { dashboardSource: dashboardSourceModel } = require('../models');

// Utils
const { unNestSequelizeObj } = require('./misc');

const createDashboardSource = async (dashboardID, queryID) => {
  let dashboardSource;

  try {
    dashboardSource = await dashboardSourceModel.create({ dashboardID, queryID });
  } catch (err) {
    throw err;
  }

  // Get nested object
  dashboardSource = unNestSequelizeObj(dashboardSource);

  return dashboardSource;
};

const getDashboardSource = async (dashboardID, queryID) => {
  let dashboardSource;

  try {
    dashboardSource = await dashboardSourceModel.findOne({ where: { dashboardID, queryID } });
  } catch (err) {
    throw err;
  }

  // Get nested object
  dashboardSource = unNestSequelizeObj(dashboardSource);

  return dashboardSource;
};

module.exports = { createDashboardSource, getDashboardSource };
