const { dashboard: Dashboard, open_dashboard: openDashboard } = require('../models');
const { unNestSequelizeObj } = require('./sequelize');

const getOpenDashboard = async (dashboardID, workspaceID, userID) => {
  let dashboard = await openDashboard.findOne({
    where: { dashboardID, workspaceID, userID },
    paranoid: false,
  });
  dashboard = unNestSequelizeObj(dashboard);

  return dashboard;
};

const createOpenDashboard = async (dashboardID, workspaceID, userID) => {
  return await openDashboard.create({ dashboardID, workspaceID, userID });
};

const getOpenDashboardsByUser = async (workspaceID, userID) => {
  let openDashboards = await openDashboard.findAll({
    attributes: [['dashboardID', 'id'], 'updatedAt'],
    where: { workspaceID, userID },
    include: {
      model: Dashboard,
      attributes: ['name'],
      required: true,
    },
    order: ['updatedAt'],
  });
  openDashboards = openDashboards.map(openDashboard => {
    openDashboard = unNestSequelizeObj(openDashboard);
    openDashboard.name = openDashboard.dashboard.name;
    delete openDashboard.dashboard;

    return openDashboard;
  });

  return openDashboards;
};

const restoreOpenDashboard = async (dashboardID, workspaceID, userID) => {
  const dashboard = await openDashboard.findOne({
    where: { dashboardID, workspaceID, userID },
    paranoid: false,
  });
  await dashboard.restore();
  await dashboard.set('updatedAt', new Date());
  return await dashboard.save();
};

const deleteOpenDashboard = async (dashboardID, workspaceID, userID) => {
  return await openDashboard.destroy({ where: { dashboardID, workspaceID, userID } });
};

const addDashboardAsOpenDashboad = async (dashboardID, workspaceID, userID) => {
  const openDashboard = await getOpenDashboard(dashboardID, workspaceID, userID);
  if (openDashboard) {
    await restoreOpenDashboard(dashboardID, workspaceID, userID);
  } else {
    await createOpenDashboard(dashboardID, workspaceID, userID);
  }
};

module.exports = {
  addDashboardAsOpenDashboad,
  createOpenDashboard,
  deleteOpenDashboard,
  getOpenDashboard,
  getOpenDashboardsByUser,
  restoreOpenDashboard,
};
