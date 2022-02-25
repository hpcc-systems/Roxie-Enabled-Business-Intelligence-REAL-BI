'use strict';
const { tableNames } = require('../constants');

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        tableNames.dashboard,
        'accessOnBehalf',
        {
          type: Sequelize.DataTypes.UUID,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.addConstraint(tableNames.dashboard, {
        fields: ['accessOnBehalf'],
        type: 'foreign key',
        name: 'FK_accessOnBehalf',
        references: {
          table: tableNames.accessOnBehalf,
          field: 'id',
        },
        onDelete: 'cascade',
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(tableNames.dashboard, 'FK_accessOnBehalf', { transaction });
      await queryInterface.removeColumn(tableNames.dashboard, 'accessOnBehalf', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
