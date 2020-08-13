'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.changeColumn('charts', 'sourceID', {
      type: DataTypes.UUID,
      allowNull: true,
    });
  },

  down: (queryInterface, DataTypes) => {
    return queryInterface.changeColumn('charts', 'sourceID', {
      type: DataTypes.UUID,
      allowNull: false,
    });
  },
};
