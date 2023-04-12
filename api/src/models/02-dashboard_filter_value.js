// Constants
const { tableNames } = require('../constants');

// Utils
const { createTablePK, createFKField, createDateTimeStamps, createString } = require('../utils/sequelize');

module.exports = (sequelize, DataTypes) => {
  const DashboardFilterValue = sequelize.define(
    tableNames.dashboardFilterValue,
    {
      id: createTablePK(DataTypes),
      dataType: createString(DataTypes, 50, true),
      value: createString(DataTypes, 255, true),
      userID: createFKField(DataTypes),
      dashboardFilterID: createFKField(DataTypes),
      ...createDateTimeStamps(DataTypes),
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      paranoid: true,
      tableName: tableNames.dashboardFilterValue,
    },
  );

  return DashboardFilterValue;
};
