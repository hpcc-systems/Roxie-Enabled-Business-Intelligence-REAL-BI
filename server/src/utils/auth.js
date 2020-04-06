// DB Models
const { user: userModel } = require('../models');

// Utils
const { awaitHandler, unNestSequelizeObj } = require('./misc');

const getUserByID = async userID => {
  let [err, user] = await awaitHandler(userModel.findOne({ where: { id: userID } }));

  // Return error
  if (err) throw err;

  // No user found with provided id
  if (!user) {
    return false;
  }

  // Get nested object
  user = unNestSequelizeObj(user);

  return user;
};

module.exports = { getUserByID };
