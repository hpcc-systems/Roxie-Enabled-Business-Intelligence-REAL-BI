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
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { charset: 'utf8', collate: 'utf8_general_ci', timestamps: false },
  );

  dashboard.associate = ({ cluster, dashboardPermission, dashboardSource, source, user, workspace }) => {
    // One-to-One relation between dashboards and clusters
    // Creates 'clusterID' foreign key on dashboard model
    dashboard.belongsTo(cluster, {
      foreignKey: { name: 'clusterID', allowNull: false },
      onDelete: 'cascade',
    });

    // One-to-One relation between dashboards and workspaces
    // Creates 'workspaceID' foreign key on dashboard model
    dashboard.belongsTo(workspace, {
      foreignKey: { name: 'workspaceID', allowNull: false },
      onDelete: 'cascade',
    });

    // Many-to-Many relation between dashboards and users
    // Creates 'dashboardID' foreign key on dashboardPermissions model
    dashboard.belongsToMany(user, {
      through: dashboardPermission,
      foreignKey: { name: 'dashboardID', allowNull: false },
      onDelete: 'cascade',
    });

    // Many-to-Many relation between dashboards and sources
    // Creates 'dashboardID' foreign key on dashboardSource model
    dashboard.belongsToMany(source, {
      through: dashboardSource,
      foreignKey: { name: 'dashboardID', allowNull: false },
      onDelete: 'cascade',
    });
  };

  return dashboard;
};
