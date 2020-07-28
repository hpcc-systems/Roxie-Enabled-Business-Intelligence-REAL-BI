'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('dashboardSources', {
      dashboardID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'dashboards',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('dashboardSources');
  },
};
