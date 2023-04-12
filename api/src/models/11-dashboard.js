// Constants
const { tableNames } = require('../constants');

// Utils
const { createTablePK, createFKField, createDateTimeStamps, createString } = require('../utils/sequelize');

module.exports = (sequelize, DataTypes) => {
  const Dashboard = sequelize.define(
    tableNames.dashboard,
    {
      id: createTablePK(DataTypes),
      name: createString(DataTypes),
      fileName: createString(DataTypes, 100, true),
      workspaceID: createFKField(DataTypes),
      clusterID: createFKField(DataTypes, true),
      layout: {
        type: DataTypes.TEXT('long'),
      },
      accessOnBehalf: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      ...createDateTimeStamps(DataTypes),
    },
    { charset: 'utf8', collate: 'utf8_general_ci', paranoid: true, tableName: tableNames.dashboard },
  );

  Dashboard.associate = function () {
    Dashboard.belongsTo(sequelize.model(tableNames.cluster), { foreignKey: 'clusterID' });
    Dashboard.hasMany(sequelize.model(tableNames.dashboardPermission), {
      as: 'permission',
      foreignKey: 'dashboardID',
    });
    Dashboard.hasMany(sequelize.model(tableNames.dashboardFilter), {
      as: 'filters',
      foreignKey: 'dashboardID',
    });
    Dashboard.hasMany(sequelize.model(tableNames.dashboardRelation), {
      as: 'relations',
      foreignKey: 'dashboardID',
    });
    Dashboard.hasMany(sequelize.model(tableNames.chart), {
      as: 'charts',
      foreignKey: 'dashboardID',
    });

    Dashboard.belongsTo(sequelize.model(tableNames.accessOnBehalf), { foreignKey: 'accessOnBehalf' });
  };

  return Dashboard;
};
