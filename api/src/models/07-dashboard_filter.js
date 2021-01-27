// Constants
const { tableNames } = require('../constants');

// Utils
const {
  createTablePK,
  createFKField,
  createDateTimeStamps,
  createJsonObject,
} = require('../utils/sequelize');

module.exports = (sequelize, DataTypes) => {
  const DashboardFilter = sequelize.define(
    tableNames.dashboardFilter,
    {
      id: createTablePK(DataTypes),
      configuration: createJsonObject(DataTypes),
      clusterID: createFKField(DataTypes),
      dashboardID: createFKField(DataTypes),
      sourceID: createFKField(DataTypes, true),
      ...createDateTimeStamps(DataTypes),
    },
    { charset: 'utf8', collate: 'utf8_general_ci', paranoid: true, tableName: tableNames.dashboardFilter },
  );

  DashboardFilter.hasMany(sequelize.model(tableNames.dashboardFilterValue), {
    as: 'value',
    foreignKey: 'dashboardFilterID',
  });
  DashboardFilter.belongsTo(sequelize.model(tableNames.source), { as: 'source', foreignKey: 'sourceID' });
  DashboardFilter.belongsTo(sequelize.model(tableNames.cluster), { foreignKey: 'clusterID' });

  return DashboardFilter;
};
