const { dashboard_permission: DashboardPermission, dashboard: Dashboard } = require('../models');
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

const createOrUpdateDashboardPermission = async (dashboardID, userID, newPermission) => {
  const { id: roleID } = await getRoleByName(newPermission);
  let permission = await DashboardPermission.findOne({ where: { dashboardID, userID } });
  if (!permission) {
    return await DashboardPermission.create({ dashboardID, userID, roleID });
  }
  if (permission.roleID !== roleID) {
    return await permission.update({ roleID });
  }
  return permission;
};

const changeDashboardsPermissionByWorkspaceID = async (workspaceID, userID, permission) => {
  //1. find all user dashboards for this workspace.
  const userDashboards = await Dashboard.findAll({
    where: { workspaceID },
    include: [
      {
        model: DashboardPermission,
        as: 'permission',
        where: { userID },
        required: true,
      },
    ],
  });

  if (userDashboards) {
    //2. find a role id
    const role = await getRoleByName(permission);
    //3. update dashboardsRole
    await DashboardPermission.update(
      {
        roleID: role.id,
      },
      {
        where: {
          userID,
          dashboardID: userDashboards.map(el => el.id),
        },
      },
    );
  }
};

module.exports = {
  changeDashboardsPermissionByWorkspaceID,
  createOrUpdateDashboardPermission,
  createDashboardPermission,
  findDashboardPermission,
};
