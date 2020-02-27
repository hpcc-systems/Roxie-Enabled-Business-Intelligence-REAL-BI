module.exports = (sequelize, DataTypes) => {
  const dashboard = sequelize.define(
    'dashboard',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      params: DataTypes.JSON,
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: false,
    },
  );

  dashboard.associate = ({ cluster, user }) => {
    // Create relation from dashboards to clusters
    dashboard.belongsTo(cluster, {
      foreignKey: { name: 'clusterID', allowNull: false },
      onDelete: 'cascade',
    });

    // Create relation from dashboards to users
    dashboard.belongsTo(user, {
      foreignKey: { name: 'userID', allowNull: false },
      onDelete: 'cascade',
    });
  };

  return dashboard;
};
