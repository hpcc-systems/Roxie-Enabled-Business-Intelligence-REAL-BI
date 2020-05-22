const { dashboardPermission: dashboardPermissionModel } = require('../models');
const { awaitHandler, unNestSequelizeObj } = require('../utils/misc');

const createDashboardPermission = async (dashboardID, userID, role) => {
  let [err] = await awaitHandler(dashboardPermissionModel.create({ dashboardID, userID, role }));

  // Return error
  if (err) throw err;

  return;
};

const getDashboardPermission = async (dashboardID, userID) => {
  let [err, permissionObj] = await awaitHandler(
    dashboardPermissionModel.findOne({ attributes: ['role'], where: { dashboardID, userID } }),
  );

  // Return error
  if (err) throw err;

  // Un-nest value
  permissionObj = unNestSequelizeObj(permissionObj);

  return permissionObj;
};

module.exports = { createDashboardPermission, getDashboardPermission };
