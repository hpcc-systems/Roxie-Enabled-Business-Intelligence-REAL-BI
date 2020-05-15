const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const dashboard = sequelize.define(
    'dashboard',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    { charset: 'utf8', collate: 'utf8_general_ci', timestamps: false },
  );

  dashboard.associate = ({ cluster, dashboardSource, query, user }) => {
    // One-to-One relation between dashboards and clusters
    // Creates 'clusterID' foreign key on dashboard model
    dashboard.belongsTo(cluster, {
      foreignKey: { name: 'clusterID', allowNull: false },
      onDelete: 'cascade',
    });

    // One-to-One relation between dashboards and users
    // Creates 'userID' foreign key on dashboard model
    dashboard.belongsTo(user, {
      foreignKey: { name: 'userID', allowNull: false },
      onDelete: 'cascade',
    });

    // Many-to-Many relation between dashboards and queries
    // Creates 'dashboardID' foreign key on dashboardSource model
    dashboard.belongsToMany(query, {
      through: dashboardSource,
      foreignKey: { name: 'dashboardID', allowNull: false },
      onDelete: 'cascade',
    });
  };

  return dashboard;
};
