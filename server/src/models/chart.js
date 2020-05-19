const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const chart = sequelize.define(
    'chart',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      dataset: DataTypes.STRING,
      options: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    { charset: 'utf8', collate: 'utf8_general_ci', timestamps: false },
  );

  chart.associate = ({ dashboard, query, userSettings }) => {
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
    chart.belongsTo(userSettings, {
      foreignKey: { name: 'ownerID', allowNull: false },
    });
  };

  return chart;
};
