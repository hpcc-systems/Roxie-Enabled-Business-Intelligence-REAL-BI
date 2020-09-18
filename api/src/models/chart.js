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
      config: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    { charset: 'utf8', collate: 'utf8_general_ci', timestamps: false },
  );

  chart.associate = ({ dashboard, source }) => {
    // One-to-One relation between charts and dashboards
    // Creates 'dashboardID' foreign key on chart model
    chart.belongsTo(dashboard, {
      foreignKey: { name: 'dashboardID', allowNull: false },
      onDelete: 'cascade',
    });

    // One-to-One relation between charts and sources
    // Creates 'sourceID' foreign key on chart model
    chart.belongsTo(source, {
      foreignKey: { name: 'sourceID' },
      onDelete: 'cascade',
    });
  };

  return chart;
};
