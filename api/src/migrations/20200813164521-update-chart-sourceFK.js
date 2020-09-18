'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.changeColumn('charts', 'sourceID', {
      type: DataTypes.UUID,
    });
  },

  down: (queryInterface, DataTypes) => {
    return queryInterface.changeColumn('charts', 'sourceID', {
      type: DataTypes.UUID,
      allowNull: false,
    });
  },
};
