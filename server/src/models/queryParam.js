module.exports = (sequelize, DataTypes) => {
  const queryParam = sequelize.define(
    'queryParam',
    {
      dataset: DataTypes.STRING(50),
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      value: DataTypes.STRING,
    },
    { charset: 'utf8', collate: 'utf8_general_ci', timestamps: false },
  );

  queryParam.associate = ({ chart, dashboard, query }) => {
    // One-to-One relation between queryParams and queries
    // Creates 'queryID' foreign key on queryParam model
    queryParam.belongsTo(query, {
      foreignKey: { name: 'queryID', allowNull: false },
      onDelete: 'cascade',
    });

    // One-to-One relation between queryParams and dashboards
    // Creates 'queryID' foreign key on queryParam model
    queryParam.belongsTo(dashboard, {
      foreignKey: { name: 'dashboardID', allowNull: true },
      onDelete: 'cascade',
    });

    // One-to-One relation between queryParams and charts
    // Creates 'queryID' foreign key on queryParam model
    queryParam.belongsTo(chart, {
      foreignKey: { name: 'chartID', allowNull: true },
      onDelete: 'cascade',
    });
  };

  return queryParam;
};
