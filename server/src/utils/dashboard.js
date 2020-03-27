// DB Models
const { dashboard: dashboardModel } = require('../models');

// Utils
const { unNestSequelizeObj } = require('./misc');

const getDashboardsByUserID = async userID => {
  let dashboards;

  try {
    dashboards = await dashboardModel.findAll({ where: { userID }, order: ['name'] });
  } catch (err) {
    throw err;
  }

  return dashboards;
};

const getDashboardByID = async dashboardID => {
  let dashboard;

  try {
    dashboard = await dashboardModel.findOne({ where: { id: dashboardID } });
  } catch (err) {
    throw err;
  }

  // Get nested object
  dashboard = unNestSequelizeObj(dashboard);

  return dashboard;
};

const createDashboard = async (clusterID, name, userID) => {
  let dashboard;

  try {
    dashboard = await dashboardModel.create({ clusterID, name, userID });
  } catch (err) {
    throw err;
  }

  // Get nested object
  dashboard = unNestSequelizeObj(dashboard);

  return dashboard;
};

module.exports = { createDashboard, getDashboardByID, getDashboardsByUserID };
