'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('dashboards', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clusterID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'clusters',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      workspaceID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'workspaces',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('dashboards');
  },
};
