const { user: userModel } = require('../models');

const getUserByID = async userID => {
  let user;

  try {
    user = await userModel.findOne({ where: { id: userID } });
  } catch (err) {
    return err;
  }

  return user.dataValues;
};

module.exports = { getUserByID };
