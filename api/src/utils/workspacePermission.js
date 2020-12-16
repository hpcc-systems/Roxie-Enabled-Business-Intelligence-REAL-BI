const { workspace_permission: WorkspacePermission } = require('../models');
const { getRoleByName } = require('./role');
const { unNestSequelizeObj } = require('./sequelize');

const createWorkspacePermission = async (workspaceID, userID, role) => {
  const { id: roleID } = await getRoleByName(role);
  return await WorkspacePermission.create({ workspaceID, userID, roleID });
};

const findWorkspacePermission = async (workspaceID, userID) => {
  let permission = await WorkspacePermission.findOne({ where: { workspaceID, userID } });
  permission = unNestSequelizeObj(permission);

  return permission;
};

module.exports = { createWorkspacePermission, findWorkspacePermission };
