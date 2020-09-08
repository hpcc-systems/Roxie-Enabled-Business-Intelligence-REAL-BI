'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    // Create column
    await queryInterface.addColumn('dashboards', 'relations', {
      type: DataTypes.JSON,
      allowNull: true,
    });

    return;
  },

  down: async queryInterface => {
    // Remove column
    await queryInterface.removeColumn('dashboards', 'relations');

    return;
  },
};
