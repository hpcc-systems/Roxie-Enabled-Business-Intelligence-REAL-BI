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
const isWorkspacePermissionRole = async (workspaceID, userID, role) => {
  const { id: roleID } = await getRoleByName(role);

  let permission = await WorkspacePermission.findOne({ where: { workspaceID, userID } });

  if (!permission || roleID !== permission.roleID) return false;
  return true;
};

const createOrUpdateWorkspacePermission = async (workspaceID, userID, newRole) => {
  const { id: roleID } = await getRoleByName(newRole);
  let permission = await WorkspacePermission.findOne({ where: { workspaceID, userID }, paranoid: false });

  if (!permission) {
    return await WorkspacePermission.create({ workspaceID, userID, roleID });
  }

  if (permission.deletedAt) {
    await permission.restore();
  }

  if (permission.roleID !== roleID) {
    permission.roleID = roleID;
    await permission.save();
  }

  return permission;
};

const deleteWorkspacePermission = async (workspaceID, userID) => {
  let permission = await WorkspacePermission.destroy({ where: { workspaceID, userID } });
  permission = unNestSequelizeObj(permission);
  return permission;
};

module.exports = {
  isWorkspacePermissionRole,
  createOrUpdateWorkspacePermission,
  deleteWorkspacePermission,
  createWorkspacePermission,
  findWorkspacePermission,
};
