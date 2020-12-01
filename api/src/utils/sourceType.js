const { source_type: SourceType } = require('../models');
const { unNestSequelizeObj } = require('./sequelize');

const getSourceTypeByName = async name => {
  let sourceType = await SourceType.findOne({ where: { name } });
  sourceType = unNestSequelizeObj(sourceType);

  return sourceType;
};

module.exports = { getSourceTypeByName };
