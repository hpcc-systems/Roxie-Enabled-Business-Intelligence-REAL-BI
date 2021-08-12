const { share: Share } = require('../models');
const { unNestSequelizeObj } = require('./sequelize');
const { createUser, getUserByEmail } = require('./user');
const { createWorkspacePermission, findWorkspacePermission } = require('./workspacePermission');
const { createWorkspaceDirectory, updateWorkspaceDirectory } = require('./workspaceDirectory');
const { createDashboardPermission, findDashboardPermission } = require('./dashboardPermission');
const {
  createFilterValue,
  getDashboardFilterValue,
  getDashboardFiltersByDashboardID,
} = require('./dashboardFilter');

const findShare = async id => {
  let share = await Share.findOne({ where: { id } });
  share = unNestSequelizeObj(share);

  return share;
};

const createShare = async shareObj => {
  let share = await Share.create(shareObj);
  share = unNestSequelizeObj(share);

  return share;
};

const markShareAsUsed = async id => {
  return await Share.destroy({ where: { id } });
};

const addSharedResourcesToUser = async (email, username, shareID) => {
  let user = await getUserByEmail(email);

  if (!user) {
    user = await createUser(email, username);
  }

  // Get shared resources
  const { id, dashboards, directory, userID, workspaceID } = await findShare(shareID);

  if (!id) throw new Error('Invalid share ID');

  // Workspace setup
  const workspacePermission = await findWorkspacePermission(workspaceID, user.id);

  if (!workspacePermission) {
    await createWorkspacePermission(workspaceID, user.id, 'Read-Only');
    await createWorkspaceDirectory(directory, workspaceID);
  } else {
    await updateWorkspaceDirectory(directory, workspaceID);
  }

  // Dashboard setup
  for await (const dashboard of dashboards) {
    const dashboardPermission = await findDashboardPermission(dashboard, user.id);

    if (!dashboardPermission) {
      await createDashboardPermission(dashboard, user.id, 'Read-Only');
    }

    const filters = await getDashboardFiltersByDashboardID(dashboard, userID);

    for await (const filter of filters) {
      const filterValue = await getDashboardFilterValue(filter.id, user.id);

      if (!filterValue) {
        await createFilterValue(filter.id, user.id);
      }
    }
  }

  return await markShareAsUsed(shareID);
};

module.exports = { addSharedResourcesToUser, createShare, markShareAsUsed };
