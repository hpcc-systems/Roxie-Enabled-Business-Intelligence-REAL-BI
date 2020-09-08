// DB Models
const { cluster: clusterModel, dashboard: dashboardModel, Sequelize } = require('../models');

// Utils
const { awaitHandler, unNestSequelizeObj } = require('./misc');

const getDashboardsByUserID = async userID => {
  let [err, dashboards] = await awaitHandler(dashboardModel.findAll({ where: { userID }, order: ['name'] }));

  // Return error
  if (err) throw err;

  return dashboards;
};

const getDashboardByID = async dashboardID => {
  let [err, dashboard] = await awaitHandler(
    dashboardModel.findOne({
      where: { id: dashboardID },
      include: {
        model: clusterModel,
        attributes: [
          ['host', 'clusterHost'],
          ['infoPort', 'clusterPort'],
        ],
        where: { id: { [Sequelize.Op.col]: 'dashboard.clusterID' } },
      },
    }),
  );

  // Return error
  if (err) throw err;

  // Get nested object
  dashboard = unNestSequelizeObj(dashboard);
  dashboard.cluster = unNestSequelizeObj(dashboard.cluster);

  // Format object
  dashboard = { ...dashboard, ...dashboard.cluster };
  delete dashboard.cluster;

  return dashboard;
};

const createDashboard = async (dashboard, workspaceID, userID) => {
  const { clusterID, name, relations = {} } = dashboard;

  let [err, newDashboard] = await awaitHandler(
    dashboardModel.create({ clusterID, name: name.trim(), relations, workspaceID, userID }),
  );

  // Return error
  if (err) throw err;

  // Get nested object
  newDashboard = unNestSequelizeObj(newDashboard);

  return newDashboard;
};

const updateDashboardByID = async dataObj => {
  const { clusterID, id, name, relations = {} } = dataObj;

  let [err] = await awaitHandler(
    dashboardModel.update({ clusterID, name: name.trim(), relations }, { where: { id } }),
  );

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
