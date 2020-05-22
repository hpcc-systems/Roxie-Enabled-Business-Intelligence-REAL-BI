const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const cluster = sequelize.define(
    'cluster',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      host: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      infoPort: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dataPort: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { charset: 'utf8', collate: 'utf8_general_ci', timestamps: false },
  );

  cluster.associate = ({ clusterAuth, user }) => {
    // Many-to-Many relation between clusters and users
    // Creates 'clusterID' foreign key on clusterAuth model
    cluster.belongsToMany(user, {
      through: clusterAuth,
      foreignKey: { name: 'clusterID', allowNull: false },
      onDelete: 'cascade',
    });
  };

  return cluster;
};
