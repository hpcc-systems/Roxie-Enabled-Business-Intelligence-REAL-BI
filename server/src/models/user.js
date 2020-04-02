module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      directory: DataTypes.JSON,
      lastDashboard: DataTypes.INTEGER,
    },
    { charset: 'utf8', collate: 'utf8_general_ci', timestamps: false },
  );

  user.associate = ({ cluster, clusterAuth }) => {
    // Many-to-Many relation between users and clusters
    // Creates 'userID' foreign key on clusterAuth model
    user.belongsToMany(cluster, {
      through: clusterAuth,
      foreignKey: { name: 'userID', allowNull: false },
      onDelete: 'cascade',
    });
  };

  return user;
};
