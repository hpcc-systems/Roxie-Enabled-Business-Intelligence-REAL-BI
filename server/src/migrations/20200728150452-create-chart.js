'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('charts', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dataset: DataTypes.STRING,
      options: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      sourceID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'sources',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      dashboardID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'dashboards',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('charts');
  },
};
