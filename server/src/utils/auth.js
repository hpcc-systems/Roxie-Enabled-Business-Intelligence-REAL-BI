// DB Models
const { user: userModel } = require('../models');

// Utils
const { unNestSequelizeObj } = require('./misc');

const getUserByID = async userID => {
  let user;

  try {
    user = await userModel.findOne({ where: { id: userID } });
  } catch (err) {
    throw err;
  }

  // No user found with provided id
  if (!user) {
    return false;
  }

  // Get nested object
  user = unNestSequelizeObj(user);

  return user;
};

module.exports = { getUserByID };
