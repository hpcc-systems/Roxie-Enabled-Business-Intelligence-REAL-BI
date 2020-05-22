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
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      value: DataTypes.TEXT,
      dataset: {
        type: DataTypes.STRING(50),
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

  dashboardParam.associate = ({ dashboard, query, user }) => {
    // One-to-One relation between dashboardParams and queries
    // Creates 'queryID' foreign key on dashboardParam model
    dashboardParam.belongsTo(query, {
      foreignKey: { name: 'queryID', allowNull: false },
      onDelete: 'cascade',
    });

    // One-to-One relation between dashboardParams and charts
    // Creates 'queryID' foreign key on dashboardParam model
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
