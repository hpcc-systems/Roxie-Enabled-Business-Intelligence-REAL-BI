'use strict';

// Constants
const { tableNames } = require('../constants');

// Utils
const { createForeignKeyConstraint, generateConstraintName } = require('../utils/sequelize');

module.exports = {
  up: async queryInterface => {
    // Create foreign key index
    await queryInterface.addConstraint(
      tableNames.user,
      createForeignKeyConstraint(tableNames.user, tableNames.workspace, ['lastViewedWorkspace']),
    );
  },

  down: async queryInterface => {
    await queryInterface.removeConstraint(
      tableNames.user,
      generateConstraintName(tableNames.user, tableNames.workspace, ['lastViewedWorkspace'], 'fk'),
    );
  },
};
