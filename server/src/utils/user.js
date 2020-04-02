const { user: userModel } = require('../models');

const updateUserDirectory = async (directory, userID) => {
  try {
    await userModel.update({ directory }, { where: { id: userID } });
  } catch (err) {
    throw err;
  }

  return;
};

const updateLastDashboard = async (lastDashboard, userID) => {
  try {
    await userModel.update({ lastDashboard }, { where: { id: userID } });
  } catch (err) {
    throw err;
  }

  return;
};

module.exports = { updateLastDashboard, updateUserDirectory };
