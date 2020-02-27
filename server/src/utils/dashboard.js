const { dashboard: dashboardModel } = require('../models');
const { setJSONField } = require('./misc');

const getDashboardByID = async id => {
  let dashboard;

  try {
    dashboard = await dashboardModel.findOne({ where: { id } });
  } catch (err) {
    throw err;
  }

  // De-nest data
  dashboard = dashboard.dataValues;

  // Format data structure
  dashboard.params = setJSONField(dashboard, 'params');

  return dashboard;
};

const getDashboardsByUser = async userID => {
  let dashboards;

  try {
    dashboards = await dashboardModel.findAll({ where: { userID }, order: ['name'] });
  } catch (err) {
    throw err;
  }

  // Iterate through array of dashboards
  dashboards = dashboards.map(dashboard => {
    /// De-nest data
    dashboard = dashboard.dataValues;

    // Format data structure
    dashboard.params = setJSONField(dashboard, 'params');

    return dashboard;
  });

  return dashboards;
};

const createDashboard = async (clusterID, name, userID) => {
  try {
    await dashboardModel.create({ clusterID, name, userID });
  } catch (err) {
    throw err;
  }

  return;
};

module.exports = { createDashboard, getDashboardByID, getDashboardsByUser };
