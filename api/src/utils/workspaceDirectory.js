const { workspace_directory: WorkspaceDirectory } = require('../models');
const { unNestSequelizeObj } = require('./sequelize');

const getWorkspaceDirectory = async workspaceID => {
  let directory = await WorkspaceDirectory.findOne({
    attributes: ['directory'],
    where: { workspaceID },
  });
  directory = unNestSequelizeObj(directory);

  return directory;
};

const updateWorkspaceDirectory = async (directory, workspaceID) => {
  return await WorkspaceDirectory.update({ directory }, { where: { workspaceID } });
};

const createWorkspaceDirectory = async (directory, workspaceID) => {
  return await WorkspaceDirectory.create({ directory, workspaceID });
};

const updateOrCreateWorkspaceDirectory = async (dashboard, workspaceID) => {
  /* workspaceFile represents a dashboard, Ids and name should be the same as dashboard*/
  const workspaceFile = {
    id: dashboard.id, // should be unique
    name: dashboard.name, // should be unique
    favorite: false,
    shared: false,
  };

  const workspaceDirectoriesArray = await getWorkspaceDirectory(workspaceID);

  if (workspaceDirectoriesArray?.directory) {
    const { directory } = workspaceDirectoriesArray;
    const existingFile = directory.find(el => el.id === workspaceFile.id);

    if (existingFile) return;
    return await updateWorkspaceDirectory([...directory, workspaceFile], workspaceID);
  } else {
    const newDirectory = [workspaceFile];
    return await createWorkspaceDirectory(newDirectory, workspaceID);
  }
};

module.exports = {
  updateOrCreateWorkspaceDirectory,
  createWorkspaceDirectory,
  getWorkspaceDirectory,
  updateWorkspaceDirectory,
};
