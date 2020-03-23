const { user: userModel } = require('../models');

// Utils
const { unNestSequelizeObj } = require('../utils/misc');

const getUserDirectory = async userID => {
  let user;

  try {
    user = await userModel.findOne({ where: { id: userID } });
  } catch (err) {
    throw err;
  }

  // Get nested object
  user = unNestSequelizeObj(user);

  return user;
};

const updateUserDirectory = async (directory, userID) => {
  try {
    await userModel.update({ directory }, { where: { id: userID } });
  } catch (err) {
    throw err;
  }

  return;
};

module.exports = { getUserDirectory, updateUserDirectory };
