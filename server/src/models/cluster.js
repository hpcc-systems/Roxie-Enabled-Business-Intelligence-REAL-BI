module.exports = (sequelize, DataTypes) => {
  const cluster = sequelize.define(
    'cluster',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      host: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      port: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: false,
    },
  );

  // Create M:M table relating clusters to users
  cluster.associate = ({ user }) => {
    cluster.belongsToMany(user, {
      through: 'clusterAuth',
      foreignKey: { name: 'clusterID', allowNull: false },
      onDelete: 'cascade',
    });
  };

  return cluster;
};
