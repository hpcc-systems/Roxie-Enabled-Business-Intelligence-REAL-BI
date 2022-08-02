// Constants
const { tableNames } = require('../constants');

// Utils
const { createTablePK, createString, createNumber, createDateTimeStamps } = require('../utils/sequelize');

module.exports = (sequelize, DataTypes) => {
  const Cluster = sequelize.define(
    tableNames.cluster,
    {
      id: createTablePK(DataTypes),
      name: createString(DataTypes, 100),
      host: {
        ...createString(DataTypes, 100),
        unique: true,
      },
      infoPort: createNumber(DataTypes),
      dataPort: createNumber(DataTypes),
      roxie_ip: DataTypes.STRING,
      ...createDateTimeStamps(DataTypes),
    },
    { charset: 'utf8', collate: 'utf8_general_ci', paranoid: true, tableName: tableNames.cluster },
  );

  Cluster.associate = function (models) {
    Cluster.hasMany(models[tableNames.clusterCredentials], { foreignKey: 'clusterID' });
  };

  return Cluster;
};
