// Constants
const { tableNames } = require('../constants');

// Utils
const { createTablePK, createString, createDateTimeStamps, createFKField } = require('../utils/sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    tableNames.user,
    {
      id: createTablePK(DataTypes),
      email: {
        ...createString(DataTypes, 254),
        unique: true,
      },
      username: createString(DataTypes, 255, true),
      lastViewedWorkspace: createFKField(DataTypes, true),
      ...createDateTimeStamps(DataTypes),
    },
    { charset: 'utf8', collate: 'utf8_general_ci', paranoid: true, tableName: tableNames.user },
  );

  User.hasMany(sequelize.model(tableNames.openDashboard), { foreignKey: 'userID' });
  User.hasMany(sequelize.model(tableNames.dashboardFilterValue), { as: 'filterValue', foreignKey: 'userID' });

  return User;
};
