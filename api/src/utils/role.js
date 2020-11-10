const { role: Role } = require('../models');
const { unNestSequelizeObj } = require('./sequelize');

const getRoleByName = async name => {
  let role = await Role.findOne({ where: { name } });
  role = unNestSequelizeObj(role);

  return role;
};

module.exports = { getRoleByName };
