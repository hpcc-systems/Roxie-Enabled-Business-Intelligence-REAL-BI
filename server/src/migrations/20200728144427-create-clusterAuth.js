'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('clusterAuth', {
      username: DataTypes.STRING,
      hash: DataTypes.STRING,
      clusterID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'clusters',
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
    return queryInterface.dropTable('clusterAuth');
  },
};
