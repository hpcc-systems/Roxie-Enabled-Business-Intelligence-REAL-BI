// Constants
const { tableNames } = require('../constants');

// Utils
const { createTablePK, createString, createDateTimeStamps, createFKField } = require('../utils/sequelize');

module.exports = (sequelize, DataTypes) => {
  const DashboardRelation = sequelize.define(
    tableNames.dashboardRelation,
    {
      id: createTablePK(DataTypes),
      sourceField: createString(DataTypes, 100),
      targetField: createString(DataTypes, 100),
      dashboardID: createFKField(DataTypes),
      sourceID: createFKField(DataTypes),
      targetID: createFKField(DataTypes),
      ...createDateTimeStamps(DataTypes),
    },
    { charset: 'utf8', collate: 'utf8_general_ci', paranoid: true, tableName: tableNames.dashboardRelation },
  );

  DashboardRelation.belongsTo(sequelize.model(tableNames.chart), { as: 'source', foreignKey: 'sourceID' });
  DashboardRelation.belongsTo(sequelize.model(tableNames.chart), { as: 'target', foreignKey: 'targetID' });

  return DashboardRelation;
};
