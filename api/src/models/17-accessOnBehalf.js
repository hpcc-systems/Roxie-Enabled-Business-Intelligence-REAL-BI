// Constants
const { tableNames } = require('../constants');
const { createDateTimeStamps } = require('../utils/sequelize');

module.exports = (sequelize, DataTypes) => {
  const AcessOnBehalf = sequelize.define(
    tableNames.accessOnBehalf,
    {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      hash: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      ...createDateTimeStamps(DataTypes),
    },
    { charset: 'utf8', collate: 'utf8_general_ci', paranoid: true, tableName: tableNames.accessOnBehalf },
  );

  AcessOnBehalf.associate = function () {
    AcessOnBehalf.hasOne(sequelize.model(tableNames.dashboard), { foreignKey: 'accessOnBehalf' });
  };

  return AcessOnBehalf;
};
