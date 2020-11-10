const {
  dashboard: Dashboard,
  open_dashboard: openDashboard,
  role: Role,
  workspace: Workspace,
  workspace_directory: workspaceDirectory,
  workspace_permission: workspacePermission,
} = require('../models');
const { unNestSequelizeObj, removeFields } = require('./sequelize');

const createWorkspace = async (name, ownerID) => {
  let workspace = await Workspace.create({ name, ownerID });
  await workspaceDirectory.create({ workspaceID: workspace.id, userID: ownerID });
  workspace = unNestSequelizeObj(workspace);

  return workspace;
};

const getWorkspacesByUserID = async userID => {
  let workspaces = await Workspace.findAll({
    ...removeFields([], true),
    include: {
      model: workspacePermission,
      as: 'permission',
      attributes: [],
      where: { userID },
      required: true,
      include: {
        model: Role,
        attributes: [],
        required: true,
      },
    },
  });
  workspaces = workspaces.map(workspace => unNestSequelizeObj(workspace));

  return workspaces;
};

const getWorkspaceByID = async (id, userID) => {
  let workspace = await Workspace.findOne({
    ...removeFields([], true),
    where: { id },
    include: [
      {
        model: workspaceDirectory,
        as: 'directory',
        where: { userID },
        required: true,
      },
      {
        model: workspacePermission,
        as: 'permission',
        where: { userID },
        required: true,
        include: {
          model: Role,
          attributes: ['name'],
          required: true,
        },
      },
      {
        model: openDashboard,
        as: 'openDashboards',
        attributes: [['dashboardID', 'id']],
        include: {
          model: Dashboard,
          attributes: ['name'],
          required: true,
        },
      },
    ],
  });
  workspace = unNestSequelizeObj(workspace);
  workspace.directory = workspace.directory[0].directory;
  workspace.permission = workspace.permission[0].role.name;
  workspace.openDashboards = workspace.openDashboards.map(openDashboard => {
    openDashboard = unNestSequelizeObj(openDashboard);
    openDashboard.name = openDashboard.dashboard.name;
    delete openDashboard.dashboard;

    return openDashboard;
  });

  return workspace;
};

const updateWorkspaceByID = async (name, id) => {
  return await Workspace.update({ name }, { where: { id } });
};

const deleteWorkspaceByID = async id => {
  return await Workspace.destroy({ where: { id } });
};

module.exports = {
  createWorkspace,
  deleteWorkspaceByID,
  getWorkspaceByID,
  getWorkspacesByUserID,
  updateWorkspaceByID,
};
