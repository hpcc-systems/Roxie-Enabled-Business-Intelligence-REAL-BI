const {
  dashboard: Dashboard,
  open_dashboard: openDashboard,
  role: Role,
  workspace: Workspace,
  workspace_directory: workspaceDirectory,
  workspace_permission: workspacePermission,
} = require('../models');
const { unNestSequelizeObj, removeFields } = require('./sequelize');
const logger = require('../config/logger');
const transporter = require('../config/nodemailer');
const { SHARE_FROM_EMAIL, SHARE_URL } = process.env;

const createWorkspace = async (name, ownerID) => {
  let workspace = await Workspace.create({ name, ownerID });
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
        attributes: [['dashboardID', 'id'], 'updatedAt'],
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

module.exports = {
  createWorkspace,
  deleteWorkspaceByID,
  getWorkspaceByID,
  getWorkspacesByUserID,
  sendShareWorkspaceEmail,
  updateWorkspaceByID,
};
