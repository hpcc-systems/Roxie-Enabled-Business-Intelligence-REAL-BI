const { user: User } = require('../models');
const { unNestSequelizeObj } = require('./sequelize');

const getUserByEmail = async email => {
  let user = await User.findOne({ where: { email } });
  user = unNestSequelizeObj(user);

  return user;
};

const getUserByUsername = async username => {
  let user = await User.findOne({ where: { username } });
  user = unNestSequelizeObj(user);

  return user;
};

const createUser = async (email, username) => {
  let user = await User.create({ email, username });
  user = unNestSequelizeObj(user);

  return user;
};

const getUserDetails = async id => {
  let user = await User.findOne({
    attributes: ['id', 'lastViewedWorkspace', 'username'],
    where: { id },
  });
  user = unNestSequelizeObj(user);

  return user;
};

const updateLastViewedWorkspace = async (lastViewedWorkspace, id) => {
  return await User.update({ lastViewedWorkspace }, { where: { id } });
};

module.exports = { createUser, getUserDetails, getUserByUsername, updateLastViewedWorkspace, getUserByEmail };
