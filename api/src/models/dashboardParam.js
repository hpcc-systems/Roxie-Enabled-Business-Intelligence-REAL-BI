const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const dashboardParam = sequelize.define(
    'dashboardParam',
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
      value: DataTypes.TEXT,
      dataset: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      field: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mappedParams: DataTypes.JSON,
    },
    { charset: 'utf8', collate: 'utf8_general_ci', timestamps: false },
  );

  dashboardParam.associate = ({ dashboard, source, user }) => {
    // One-to-One relation between dashboardParams and sources
    // Creates 'sourceID' foreign key on dashboardParam model
    dashboardParam.belongsTo(source, {
      foreignKey: { name: 'sourceID', allowNull: false },
      onDelete: 'cascade',
    });

    // One-to-One relation between dashboardParams and charts
    // Creates 'dashboardID' foreign key on dashboardParam model
    dashboardParam.belongsTo(dashboard, {
      foreignKey: { name: 'dashboardID', allowNull: false },
      onDelete: 'cascade',
    });

    // One-to-One relation between dashboardParams and users
    // Creates 'userID' foreign key on dashboardParam model
    dashboardParam.belongsTo(user, {
      foreignKey: { name: 'userID', allowNull: false },
      onDelete: 'cascade',
    });
  };

  return dashboardParam;
};
