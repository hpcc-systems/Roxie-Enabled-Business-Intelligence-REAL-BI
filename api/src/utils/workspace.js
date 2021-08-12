const {
  dashboard: Dashboard,
  dashboard_permission: DashboardPermission,
  open_dashboard: openDashboard,
  role: Role,
  workspace: Workspace,
  workspace_directory: workspaceDirectory,
  workspace_permission: workspacePermission,
} = require('../models');
const { unNestSequelizeObj, removeFields } = require('./sequelize');
const logger = require('../config/logger');
const transporter = require('../config/nodemailer');
const { createOrUpdateWorkspacePermission } = require('./workspacePermission');
const { SHARE_FROM_EMAIL, SHARE_URL } = process.env;

const createWorkspace = async (name, ownerID, visibility = 'private') => {
  let workspace = await Workspace.create({ name, ownerID, visibility });
  await workspaceDirectory.create({ workspaceID: workspace.id, userID: ownerID });
  workspace = unNestSequelizeObj(workspace);

  return workspace;
};

const getWorkspacesByUserID = async userID => {
  let workspaces = await Workspace.findAll({
    ...removeFields([]),
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
    ...removeFields([]),
    where: { id },
    include: [
      {
        model: workspaceDirectory,
        as: 'directory',
        where: { workspaceID: id },
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
        attributes: [['dashboardID', 'id'], 'updatedAt'],
        include: {
          model: Dashboard,
          attributes: ['name'],
          required: true,
        },
      },
      {
        model: Dashboard,
        as: 'dashboards',
        attributes: ['id', 'name'],
        include: {
          model: DashboardPermission,
          as: 'permission',
          attributes: ['id', 'userID'],
          include: {
            model: Role,
            attributes: ['name'],
          },
        },
      },
    ],
    order: [[{ model: openDashboard, as: 'openDashboards' }, 'updatedAt', 'ASC']],
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
  workspace.dashboards = workspace.dashboards.map(dashboard => {
    const dashObject = dashboard.toJSON();
    let dashboardPermission;
    if (dashObject.permission.length > 0) {
      const userPermission = dashObject.permission.find(permission => permission.userID === userID);
      dashboardPermission = userPermission ? userPermission.role.name : 'Read-Only';
    } else {
      dashboardPermission = 'Read-Only';
    }
    dashObject.permission = dashboardPermission;
    return dashObject;
  });

  return workspace;
};

const updateWorkspaceByID = async (updatedFields, id) => {
  return await Workspace.update({ ...updatedFields }, { where: { id } });
};

const deleteWorkspaceByID = async id => {
  return await Workspace.destroy({ where: { id } });
};

const sendShareWorkspaceEmail = async (shareID, workspaceID, recipientEmail, newUser) => {
  const url = newUser ? `${SHARE_URL}/register/${shareID}` : `${SHARE_URL}/workspace/${workspaceID}`;
  const message = `<p>A user has shared a workspace with you. Please click on the link <a href="${url}">here</a> to view the workspace.</p>`;

  const options = {
    from: SHARE_FROM_EMAIL,
    to: recipientEmail,
    subject: 'Real BI - Shared Workspace',
    html: message,
  };

  const info = await transporter.sendMail(options);

  return logger.info(`Email sent with share id ${shareID} and message id ${info.messageId}`);
};

const findOrCreatePublicWorkspace = async (userID, workspaceName) => {
  let workspace = await await Workspace.findOne({ where: { name: workspaceName, visibility: 'public' } });
  if (!workspace) {
    workspace = await createWorkspace(workspaceName, userID, 'public');
  }
  await createOrUpdateWorkspacePermission(workspace.id, userID, 'Owner'); // everybody who hit this route are workspace owners cuz it is public. this will add ws to dropdown list in ui
  return workspace;
};
const getWorkspaceFromDB = async condition => {
  return await Workspace.findOne({ where: condition });
};

module.exports = {
  getWorkspaceFromDB,
  findOrCreatePublicWorkspace,
  createWorkspace,
  deleteWorkspaceByID,
  getWorkspaceByID,
  getWorkspacesByUserID,
  sendShareWorkspaceEmail,
  updateWorkspaceByID,
};
