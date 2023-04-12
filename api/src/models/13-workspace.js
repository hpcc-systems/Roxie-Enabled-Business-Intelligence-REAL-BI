// Constants
const { tableNames } = require('../constants');

// Utils
const { createTablePK, createString, createDateTimeStamps } = require('../utils/sequelize');

module.exports = (sequelize, DataTypes) => {
  const Workspace = sequelize.define(
    tableNames.workspace,
    {
      id: createTablePK(DataTypes),
      name: createString(DataTypes, 100),
      visibility: { ...createString(DataTypes, 45), defaultValue: 'private' },
      ...createDateTimeStamps(DataTypes),
    },
    { charset: 'utf8', collate: 'utf8_general_ci', paranoid: true, tableName: tableNames.workspace },
  );

  Workspace.hasMany(sequelize.model(tableNames.dashboard), { as: 'dashboards', foreignKey: 'workspaceID' });

  Workspace.hasMany(sequelize.model(tableNames.workspaceDirectory), {
    as: 'directory',
    foreignKey: 'workspaceID',
  });

  Workspace.hasMany(sequelize.model(tableNames.workspacePermission), {
    as: 'permission',
    foreignKey: 'workspaceID',
  });

  Workspace.hasMany(sequelize.model(tableNames.openDashboard), {
    as: 'openDashboards',
    foreignKey: 'workspaceID',
  });

  return Workspace;
};
