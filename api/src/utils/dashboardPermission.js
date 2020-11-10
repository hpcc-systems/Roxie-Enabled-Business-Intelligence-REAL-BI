const { dashboard_permission: dashboardPermission } = require('../models');
const { getRoleByName } = require('./role');

const createDashboardPermission = async (dashboardID, userID, role) => {
  const { id: roleID } = await getRoleByName(role);
  return await dashboardPermission.create({ dashboardID, userID, roleID });
};

module.exports = { createDashboardPermission };
