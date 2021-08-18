const { dashboard: Dashboard, open_dashboard: openDashboard } = require('../models');
const { unNestSequelizeObj } = require('./sequelize');

const getOpenDashboard = async (dashboardID, workspaceID, userID) => {
  let dashboard = await openDashboard.findOne({
    where: { dashboardID, workspaceID, userID },
    paranoid: false,
  });

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

const deleteOpenDashboard = async (dashboardID, workspaceID, userID, deleteForAllUsers) => {
  if (deleteForAllUsers) {
    return await openDashboard.destroy({ where: { dashboardID, workspaceID } });
  } else {
    return await openDashboard.destroy({ where: { dashboardID, workspaceID, userID } });
  }
};

const addDashboardAsOpenDashboard = async (dashboardID, workspaceID, userID) => {
  let openDashboard = await getOpenDashboard(dashboardID, workspaceID, userID);
  if (openDashboard?.deletedAt) {
    await openDashboard.restore();
    await openDashboard.set('updatedAt', new Date());
    await openDashboard.save();
    console.log('--------------------------------');
    console.log(`restored`, openDashboard);
    console.log('--------------------------------');
  } else if (!openDashboard) {
    openDashboard = await createOpenDashboard(dashboardID, workspaceID, userID);
    console.log('--------------------------------');
    console.log(`recreated`, openDashboard);
    console.log('--------------------------------');
  }
  console.log('-------------------------');
  console.log(`openDashboard.toJSON()`, openDashboard.toJSON());
  console.log('-------------------------');

  return openDashboard.toJSON();
};

module.exports = {
  addDashboardAsOpenDashboard,
  createOpenDashboard,
  deleteOpenDashboard,
  getOpenDashboard,
  getOpenDashboardsByUser,
  restoreOpenDashboard,
};
