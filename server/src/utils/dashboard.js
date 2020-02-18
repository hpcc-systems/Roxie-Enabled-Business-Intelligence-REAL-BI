const { dashboard: dashboardModel } = require('../models');

const getDashboardByID = async id => {
  let dashboard;

  try {
    dashboard = await dashboardModel.findOne({ where: { id } });
  } catch (err) {
    throw err;
  }

  return dashboard.dataValues;
};

const getDashboardsByUser = async userID => {
  let dashboards;

  try {
    dashboards = await dashboardModel.findAll({ where: { userID }, order: ['name'] });
  } catch (err) {
    throw err;
  }

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
