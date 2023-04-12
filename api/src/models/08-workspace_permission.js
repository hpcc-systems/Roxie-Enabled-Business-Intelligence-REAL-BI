// Constants
const { tableNames } = require('../constants');

// Utils
const { createTablePK, createFKField, createDateTimeStamps } = require('../utils/sequelize');

module.exports = (sequelize, DataTypes) => {
  const WorkspacePermission = sequelize.define(
    tableNames.workspacePermission,
    {
      id: createTablePK(DataTypes),
      userID: createFKField(DataTypes),
      workspaceID: createFKField(DataTypes),
      roleID: createFKField(DataTypes),
      ...createDateTimeStamps(DataTypes),
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      paranoid: true,
      tableName: tableNames.workspacePermission,
    },
  );

  WorkspacePermission.belongsTo(sequelize.model(tableNames.role), { foreignKey: 'roleID' });

  return WorkspacePermission;
};
