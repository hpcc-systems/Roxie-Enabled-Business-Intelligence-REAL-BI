'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      lastWorkspace: DataTypes.UUID,
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('users');
  },
};
