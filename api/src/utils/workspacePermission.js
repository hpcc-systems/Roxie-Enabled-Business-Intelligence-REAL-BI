const { workspace_permission: workspacePermission } = require('../models');
const { getRoleByName } = require('./role');

const createWorkspacePermission = async (workspaceID, userID, role) => {
  const { id: roleID } = await getRoleByName(role);
  return await workspacePermission.create({ workspaceID, userID, roleID });
};

module.exports = { createWorkspacePermission };
