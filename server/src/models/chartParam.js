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
      dataset: DataTypes.STRING,
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: DataTypes.STRING,
    },
    { charset: 'utf8', collate: 'utf8_general_ci', timestamps: false },
  );

  chartParam.associate = ({ chart, source }) => {
    // One-to-One relation between chartParams and sources
    // Creates 'sourceID' foreign key on chartParam model
    chartParam.belongsTo(source, {
      foreignKey: { name: 'sourceID', allowNull: false },
      onDelete: 'cascade',
    });

    // One-to-One relation between chartParams and charts
    // Creates 'chartID' foreign key on chartParam model
    chartParam.belongsTo(chart, {
      foreignKey: { name: 'chartID', allowNull: true },
      onDelete: 'cascade',
    });
  };

  return chartParam;
};
