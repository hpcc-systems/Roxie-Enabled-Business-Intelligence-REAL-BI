// Constants
const { tableNames } = require('../constants');

// Utils
const { createTablePK, createFKField, createDateTimeStamps, createString } = require('../utils/sequelize');

module.exports = (sequelize, DataTypes) => {
  const Source = sequelize.define(
    tableNames.source,
    {
      id: createTablePK(DataTypes),
      name: createString(DataTypes, 255),
      hpccID: createString(DataTypes, 255),
      target: createString(DataTypes, 255),
      typeID: createFKField(DataTypes),
      ...createDateTimeStamps(DataTypes),
    },
    { charset: 'utf8', collate: 'utf8_general_ci', paranoid: true, tableName: tableNames.source },
  );

  Source.belongsTo(sequelize.model(tableNames.sourceType), { as: 'type', foreignKey: 'typeID' });

  return Source;
};
