module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      lastWorkspace: DataTypes.UUID,
      email: DataTypes.STRING,
      authServiceID: DataTypes.INTEGER,
    },
    { charset: 'utf8', collate: 'utf8_general_ci', timestamps: false },
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
