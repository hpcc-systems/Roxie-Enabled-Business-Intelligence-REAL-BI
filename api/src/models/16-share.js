const { tableNames } = require('../constants');

// Utils
const {
  createTablePK,
  createString,
  createDateTimeStamps,
  createFKField,
  createJsonArray,
  createJsonObject,
} = require('../utils/sequelize');

module.exports = (sequelize, DataTypes) => {
  const Share = sequelize.define(
    tableNames.share,
    {
      id: createTablePK(DataTypes),
      email: createString(DataTypes, 254),
      directory: createJsonObject(DataTypes),
      dashboards: createJsonArray(DataTypes),
      userID: createFKField(DataTypes),
      workspaceID: createFKField(DataTypes),
      ...createDateTimeStamps(DataTypes),
    },
    { charset: 'utf8', collate: 'utf8_general_ci', paranoid: true, tableName: tableNames.share },
  );

  Share.belongsTo(sequelize.model(tableNames.user), { foreignKey: 'userID' });
  Share.belongsTo(sequelize.model(tableNames.workspace), { foreignKey: 'workspaceID' });

  return Share;
};
