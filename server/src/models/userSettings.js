module.exports = (sequelize, DataTypes) => {
  const userSettings = sequelize.define(
    'userSettings',
    {
      directory: DataTypes.JSON,
      directoryDepth: DataTypes.JSON,
      lastDashboard: DataTypes.UUID,
    },
    { charset: 'utf8', collate: 'utf8_general_ci', tableName: 'userSettings', timestamps: false },
  );

  userSettings.associate = ({ cluster, clusterAuth }) => {
    // Many-to-Many relation between users and clusters
    // Creates 'userID' foreign key on clusterAuth model
    userSettings.belongsToMany(cluster, {
      through: clusterAuth,
      foreignKey: { name: 'userID', allowNull: false },
      onDelete: 'cascade',
    });
  };

  return userSettings;
};
