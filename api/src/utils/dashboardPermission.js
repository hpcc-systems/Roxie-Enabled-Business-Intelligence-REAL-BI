const { dashboard_permission: DashboardPermission } = require('../models');
const { getRoleByName } = require('./role');
const { unNestSequelizeObj } = require('./sequelize');

const createDashboardPermission = async (dashboardID, userID, role) => {
  const { id: roleID } = await getRoleByName(role);
  return await DashboardPermission.create({ dashboardID, userID, roleID });
};

const findDashboardPermission = async (dashboardID, userID) => {
  let permission = await DashboardPermission.findOne({ where: { dashboardID, userID } });
  permission = unNestSequelizeObj(permission);

  return permission;
};

module.exports = { createDashboardPermission, findDashboardPermission };
