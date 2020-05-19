const { userSettings: userSettingsModel } = require('../models');

//Utils
const { awaitHandler } = require('./misc');

const createUserSettings = async userID => {
  await userSettingsModel.create({ id: userID, directory: [], directoryDepth: [] });

  return;
};

const updateUserDirectory = async (directory, userID) => {
  let [err] = await awaitHandler(userSettingsModel.update({ directory }, { where: { id: userID } }));

  // Return error
  if (err) throw err;

  return;
};

const updateLastDashboard = async (lastDashboard, userID) => {
  let [err] = await awaitHandler(userSettingsModel.update({ lastDashboard }, { where: { id: userID } }));

  // Return error
  if (err) throw err;

  return;
};

const updateDirectoryDepth = async (directoryDepth, userID) => {
  let [err] = await awaitHandler(userSettingsModel.update({ directoryDepth }, { where: { id: userID } }));

  // Return error
  if (err) throw err;

  return;
};

module.exports = { createUserSettings, updateDirectoryDepth, updateLastDashboard, updateUserDirectory };
