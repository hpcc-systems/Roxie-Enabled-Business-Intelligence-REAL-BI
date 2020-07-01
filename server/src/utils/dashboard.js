// DB Models
const { dashboard: dashboardModel } = require('../models');

// Utils
const { awaitHandler, unNestSequelizeObj } = require('./misc');

const getDashboardsByUserID = async userID => {
  let [err, dashboards] = await awaitHandler(dashboardModel.findAll({ where: { userID }, order: ['name'] }));

  // Return error
  if (err) throw err;

  return dashboards;
};

const getDashboardByID = async dashboardID => {
  let [err, dashboard] = await awaitHandler(dashboardModel.findOne({ where: { id: dashboardID } }));

  // Return error
  if (err) throw err;

  // Get nested object
  dashboard = unNestSequelizeObj(dashboard);

  return dashboard;
};

const createDashboard = async (clusterID, name, userID) => {
  let [err, dashboard] = await awaitHandler(dashboardModel.create({ clusterID, name, userID }));

  // Return error
  if (err) throw err;

  // Get nested object
  dashboard = unNestSequelizeObj(dashboard);

  return dashboard;
};

const updateDashboardByID = async dataObj => {
  const { clusterID, dashboardID, name } = dataObj;

  let [err] = await awaitHandler(dashboardModel.update({ clusterID, name }, { where: { id: dashboardID } }));

  // Return error
  if (err) throw err;

  return;
};

const deleteDashboardByID = async dashboardID => {
  let [err] = await awaitHandler(dashboardModel.destroy({ where: { id: dashboardID } }));

  // Return error
  if (err) throw err;

  return;
};

module.exports = {
  createDashboard,
  deleteDashboardByID,
  getDashboardByID,
  getDashboardsByUserID,
  updateDashboardByID,
};
