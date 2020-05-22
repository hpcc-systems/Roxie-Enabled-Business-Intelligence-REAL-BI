module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      directory: DataTypes.JSON,
      directoryDepth: DataTypes.JSON,
      lastDashboard: DataTypes.UUID,
    },
    { charset: 'utf8', collate: 'utf8_general_ci', tableName: 'user', timestamps: false },
  );

  user.associate = ({ cluster, clusterAuth, dashboard, dashboardPermission }) => {
    // Many-to-Many relation between users and clusters
    // Creates 'userID' foreign key on clusterAuth model
    user.belongsToMany(cluster, {
      through: clusterAuth,
      foreignKey: { name: 'userID', allowNull: false },
      onDelete: 'cascade',
    });

    // Many-to-Many relation between users and dashboards
    // Creates 'userID' foreign key on dashboardPermission model
    user.belongsToMany(dashboard, {
      through: dashboardPermission,
      foreignKey: { name: 'userID', allowNull: false },
      onDelete: 'cascade',
    });
  };

  return user;
};
