const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const chartParam = sequelize.define(
    'chartParam',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
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

  chartParam.associate = ({ chart, query }) => {
    // One-to-One relation between chartParams and queries
    // Creates 'queryID' foreign key on chartParam model
    chartParam.belongsTo(query, {
      foreignKey: { name: 'queryID', allowNull: false },
      onDelete: 'cascade',
    });

    // One-to-One relation between chartParams and charts
    // Creates 'queryID' foreign key on chartParam model
    chartParam.belongsTo(chart, {
      foreignKey: { name: 'chartID', allowNull: true },
      onDelete: 'cascade',
    });
  };

  return chartParam;
};
