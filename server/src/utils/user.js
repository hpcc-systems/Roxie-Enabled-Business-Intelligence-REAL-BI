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

  user = unNestSequelizeObj(user);

  return user;
};

module.exports = { getUserDirectory };
