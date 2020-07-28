'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('dashboardParams', {
      id: {
        type: DataTypes.UUID,
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
    return queryInterface.dropTable('dashboardParams');
  },
};
