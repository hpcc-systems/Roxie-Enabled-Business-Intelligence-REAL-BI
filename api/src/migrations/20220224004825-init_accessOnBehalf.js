'use strict';

const { tableNames } = require('../constants');
const { createDateTimeStamps } = require('../utils/sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        tableNames.accessOnBehalf,
        {
          id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
          },
          username: {
            allowNull: true,
            type: Sequelize.STRING(255),
          },
          hash: {
            allowNull: true,
            type: Sequelize.STRING(255),
          },
          ...createDateTimeStamps(Sequelize.DataTypes),
        },
        { transaction },
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable(tableNames.accessOnBehalf);
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
