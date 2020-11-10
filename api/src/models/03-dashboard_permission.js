// Constants
const { tableNames } = require('../constants');

// Utils
const { createTablePK, createFKField, createDateTimeStamps } = require('../utils/sequelize');

module.exports = (sequelize, DataTypes) => {
  const DashboardPermission = sequelize.define(
    tableNames.dashboardPermission,
    {
      id: createTablePK(DataTypes),
      userID: createFKField(DataTypes),
      dashboardID: createFKField(DataTypes),
      roleID: createFKField(DataTypes),
      ...createDateTimeStamps(DataTypes),
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      paranoid: true,
      tableName: tableNames.dashboardPermission,
    },
  );

  DashboardPermission.belongsTo(sequelize.model(tableNames.role), { foreignKey: 'roleID' });

  return DashboardPermission;
};
