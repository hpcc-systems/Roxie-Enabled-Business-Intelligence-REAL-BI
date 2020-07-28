'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('sources', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      hpccID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      target: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('sources');
  },
};
