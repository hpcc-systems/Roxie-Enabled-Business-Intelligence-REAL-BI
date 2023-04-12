'use strict';

// Constants
const { tableNames } = require('../constants');

// Utils
const { createForeignKeyConstraint, generateConstraintName } = require('../utils/sequelize');

module.exports = {
  up: async queryInterface => {
    await queryInterface.removeConstraint(
      tableNames.user,
      generateConstraintName(tableNames.user, tableNames.workspace, ['lastViewedWorkspace'], 'fk'),
    );

    // Make FK not cascade delete
    await queryInterface.addConstraint(tableNames.user, {
      ...createForeignKeyConstraint(tableNames.user, tableNames.workspace, ['lastViewedWorkspace']),
      onDelete: 'SET NULL',
    });
  },

  down: async queryInterface => {
    await queryInterface.removeConstraint(
      tableNames.user,
      generateConstraintName(tableNames.user, tableNames.workspace, ['lastViewedWorkspace'], 'fk'),
    );

    await queryInterface.addConstraint(
      tableNames.user,
      createForeignKeyConstraint(tableNames.user, tableNames.workspace, ['lastViewedWorkspace']),
    );
  },
};
