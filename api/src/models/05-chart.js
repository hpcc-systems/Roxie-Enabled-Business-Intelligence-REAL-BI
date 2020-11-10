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
  const Chart = sequelize.define(
    tableNames.chart,
    {
      id: createTablePK(DataTypes),
      configuration: createJsonObject(DataTypes),
      dashboardID: createFKField(DataTypes),
      sourceID: createFKField(DataTypes, true),
      ...createDateTimeStamps(DataTypes),
    },
    { charset: 'utf8', collate: 'utf8_general_ci', paranoid: true, tableName: tableNames.chart },
  );

  Chart.belongsTo(sequelize.model(tableNames.source), { as: 'source', foreignKey: 'sourceID' });

  return Chart;
};
