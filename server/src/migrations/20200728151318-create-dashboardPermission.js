'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('dashboardPermissions', {
      role: DataTypes.STRING,
      dashboardID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'dashboards',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('dashboardPermissions');
  },
};
