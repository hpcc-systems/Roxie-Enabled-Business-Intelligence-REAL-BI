'use strict';

module.exports = {
  up: async queryInterface => {
    // Rename column
    await queryInterface.renameColumn('charts', 'options', 'config');

    // Add values from columns to config object
    await queryInterface.sequelize.query(
      `UPDATE charts
       SET
       config = JSON_INSERT(config, "$.type", type, "$.dataset", dataset);
      `,
    );

    // Remove columns
    await queryInterface.removeColumn('charts', 'type');
    await queryInterface.removeColumn('charts', 'dataset');

    return;
  },

  down: async (queryInterface, DataTypes) => {
    // Create columns
    await queryInterface.addColumn('charts', 'type', { type: DataTypes.STRING, allowNull: false });
    await queryInterface.addColumn('charts', 'dataset', { type: DataTypes.STRING });

    // Add values from config object to individual columns and remove keys from object
    await queryInterface.sequelize.query(
      `UPDATE charts
       SET
        type = JSON_UNQUOTE(JSON_EXTRACT(config, "$.type")),
        dataset = JSON_UNQUOTE(JSON_EXTRACT(config, "$.dataset")),
        config = JSON_REMOVE(config, "$.type", "$.dataset");
      `,
    );

    // Rename column
    await queryInterface.renameColumn('charts', 'config', 'options');

    return;
  },
};
