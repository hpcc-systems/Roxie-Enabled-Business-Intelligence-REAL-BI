module.exports = (sequelize, DataTypes) => {
  const chart = sequelize.define(
    'chart',
    {
      type: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      dataset: DataTypes.STRING,
      options: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      groupBy: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      sort: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    { charset: 'utf8', collate: 'utf8_general_ci', timestamps: false },
  );

  chart.associate = ({ dashboard, query, user }) => {
    // One-to-One relation between charts and dashboards
    // Creates 'dashboardID' foreign key on chart model
    chart.belongsTo(dashboard, {
      foreignKey: { name: 'dashboardID', allowNull: false },
      onDelete: 'cascade',
    });

    // One-to-One relation between charts and queries
    // Creates 'queryID' foreign key on chart model
    chart.belongsTo(query, {
      foreignKey: { name: 'queryID', allowNull: false },
      onDelete: 'cascade',
    });

    // One-to-One relation between charts and users
    // Creates 'ownerID' foreign key on chart model
    chart.belongsTo(user, {
      foreignKey: { name: 'ownerID', allowNull: false },
    });
  };

  return chart;
};
