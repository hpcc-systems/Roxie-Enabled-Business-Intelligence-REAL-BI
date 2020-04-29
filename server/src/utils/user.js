const { user: userModel } = require('../models');

//Utils
const { awaitHandler } = require('../utils/misc');

const updateUserDirectory = async (directory, userID) => {
  let [err] = await awaitHandler(userModel.update({ directory }, { where: { id: userID } }));

  // Return error
  if (err) throw err;

  return;
};

const updateLastDashboard = async (lastDashboard, userID) => {
  let [err] = await awaitHandler(userModel.update({ lastDashboard }, { where: { id: userID } }));

  // Return error
  if (err) throw err;

  return;
};

const updateDirectoryDepth = async (directoryDepth, userID) => {
  let [err] = await awaitHandler(userModel.update({ directoryDepth }, { where: { id: userID } }));

  // Return error
  if (err) throw err;

  return;
};

module.exports = { updateDirectoryDepth, updateLastDashboard, updateUserDirectory };
