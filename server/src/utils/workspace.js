const { workspace: workspaceModel } = require('../models');

// Utils
const { awaitHandler, unNestSequelizeObj } = require('./misc');

const createWorkspace = async (name, userID) => {
  const workspaceConfig = {
    name,
    directory: [],
    directoryDepth: [],
    openDashboards: [],
    userID,
  };

  let [err, newWorkspace] = await awaitHandler(workspaceModel.create({ ...workspaceConfig }));

  // Return error
  if (err) throw err;

  // Get nested object
  newWorkspace = unNestSequelizeObj(newWorkspace);

  return newWorkspace;
};

const getWorkspaces = async userID => {
  let [err, workspaces] = await awaitHandler(
    workspaceModel.findAll({
      attributes: { exclude: ['deleted', 'deletedDate', 'userID'] },
      where: { userID, deleted: false },
    }),
  );

  // Return error
  if (err) throw err;

  if (workspaces.length > 0) {
    // Get nested objects
    workspaces = workspaces.map(workspace => unNestSequelizeObj(workspace));
  } else {
    workspaces = [];
  }

  return workspaces;
};

const getWorkspaceByID = async workspaceID => {
  let [err, workspace] = await awaitHandler(
    workspaceModel.findOne({
      attributes: { exclude: ['deleted', 'deletedDate', 'userID'] },
      where: { id: workspaceID },
    }),
  );

  // Return error
  if (err) throw err;

  // Get nested object
  workspace = unNestSequelizeObj(workspace);

  return workspace;
};

const updateDirectory = async (directory, workspaceID) => {
  let [err] = await awaitHandler(workspaceModel.update({ directory }, { where: { id: workspaceID } }));

  // Return error
  if (err) throw err;

  return;
};

const updateDirectoryDepth = async (directoryDepth, workspaceID) => {
  let [err] = await awaitHandler(workspaceModel.update({ directoryDepth }, { where: { id: workspaceID } }));

  // Return error
  if (err) throw err;

  return;
};

const updateOpenDashboards = async (openDashboards, workspaceID) => {
  let [err] = await awaitHandler(workspaceModel.update({ openDashboards }, { where: { id: workspaceID } }));

  // Return error
  if (err) throw err;

  return;
};

module.exports = {
  createWorkspace,
  getWorkspaceByID,
  getWorkspaces,
  updateDirectory,
  updateDirectoryDepth,
  updateOpenDashboards,
};
