// Constants
const { tableNames } = require('../constants');

// Utils
const { createTablePK, createString, createDateTimeStamps } = require('../utils/sequelize');

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    tableNames.role,
    {
      id: createTablePK(DataTypes),
      name: {
        ...createString(DataTypes, 25),
        unique: true,
      },
      ...createDateTimeStamps(DataTypes),
    },
    { charset: 'utf8', collate: 'utf8_general_ci', paranoid: true, tableName: tableNames.role },
  );

  return Role;
};
