// Constants
const { tableNames } = require('../constants');

// Utils
const { createTablePK, createFKField, createDateTimeStamps, createJsonArray } = require('../utils/sequelize');

module.exports = (sequelize, DataTypes) => {
  const WorkspaceDirectory = sequelize.define(
    tableNames.workspaceDirectory,
    {
      id: createTablePK(DataTypes),
      directory: createJsonArray(DataTypes),
      userID: createFKField(DataTypes),
      workspaceID: createFKField(DataTypes),
      ...createDateTimeStamps(DataTypes),
    },
    { charset: 'utf8', collate: 'utf8_general_ci', paranoid: true, tableName: tableNames.workspaceDirectory },
  );

  return WorkspaceDirectory;
};
