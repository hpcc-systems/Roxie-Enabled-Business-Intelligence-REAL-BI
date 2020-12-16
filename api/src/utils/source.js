const { source: Source, source_type: SourceType } = require('../models');
const { getSourceTypeByName } = require('./sourceType');
const { unNestSequelizeObj, removeFields } = require('./sequelize');

const createSource = async source => {
  const { id: typeID } = await getSourceTypeByName(source.type);
  let newSource = await Source.create({ ...source, typeID });
  newSource = unNestSequelizeObj(newSource);

  return newSource;
};

const getSourceByID = async id => {
  let source = await Source.findOne({
    ...removeFields(['typeID']),
    where: { id },
    include: {
      model: SourceType,
      as: 'type',
      attributes: ['name'],
      required: true,
    },
  });
  source = unNestSequelizeObj(source);

  if (source) {
    source.type = source.type.name;
  }

  return source;
};

const getSourceByHpccID = async hpccID => {
  let source = await Source.findOne({
    ...removeFields(['typeID']),
    where: { hpccID },
    include: {
      model: SourceType,
      as: 'type',
      attributes: ['name'],
      required: true,
    },
  });
  source = unNestSequelizeObj(source);

  if (source) {
    source.type = source.type.name;
  }

  return source;
};

const updateSourceByID = async (id, optionsObj) => {
  return await Source.update(optionsObj, { where: { id } });
};

const deleteSourceByID = async id => {
  return await Source.destroy({ where: { id } });
};

module.exports = { createSource, deleteSourceByID, getSourceByHpccID, getSourceByID, updateSourceByID };
