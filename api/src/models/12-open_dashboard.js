// Constants
const { tableNames } = require('../constants');

// Utils
const { createTablePK, createFKField, createDateTimeStamps } = require('../utils/sequelize');

module.exports = (sequelize, DataTypes) => {
  const OpenDashboard = sequelize.define(
    tableNames.openDashboard,
    {
      id: createTablePK(DataTypes),
      userID: createFKField(DataTypes),
      workspaceID: createFKField(DataTypes),
      dashboardID: createFKField(DataTypes),
      ...createDateTimeStamps(DataTypes),
    },
    { charset: 'utf8', collate: 'utf8_general_ci', paranoid: true, tableName: tableNames.openDashboard },
  );

  OpenDashboard.belongsTo(sequelize.model(tableNames.dashboard), { foreignKey: 'dashboardID' });

  return OpenDashboard;
};
