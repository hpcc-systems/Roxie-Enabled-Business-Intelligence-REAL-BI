'use strict';

const { v4: uuidv4 } = require('uuid');
const { chart: chartModel, sequelize } = require('../models');
const { awaitHandler, unNestSequelizeObj } = require('../utils/misc');

module.exports = {
  up: async queryInterface => {
    // Get all charts in DB
    let [, charts] = await awaitHandler(chartModel.findAll());
    charts = charts.map(chart => unNestSequelizeObj(chart));

    // loop through charts
    const promises = charts.map(async ({ id: chartID, config }) => {
      // Get params for chart
      let params = await queryInterface.sequelize.query(
        `SELECT dataset, name, type, value FROM chartParams WHERE chartID = "${chartID}";`,
        { raw: true, type: sequelize.QueryTypes.SELECT },
      );

      // Update config object
      config = { ...config, params };

      // Return promise to update database config object containing params
      return chartModel.update({ config }, { where: { id: chartID } });
    });

    // Complete update promises to DB
    await Promise.all(promises);

    return queryInterface.dropTable('chartParams');
  },

  down: async (queryInterface, DataTypes) => {
    // Create chartParams table
    await queryInterface.createTable('chartParams', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      dataset: DataTypes.STRING,
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: DataTypes.STRING,
      sourceID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'sources',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      chartID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'charts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });

    // Get all charts in DB
    let [, charts] = await awaitHandler(chartModel.findAll());
    charts = charts.map(chart => unNestSequelizeObj(chart));

    let params = [];

    // loop through charts
    charts.forEach(({ id: chartID, config, sourceID }) => {
      // Loop through config.params array
      return config.params.forEach(param => {
        // Create a row for each param object in array
        return params.push({ id: uuidv4(), chartID, sourceID, ...param });
      });
    });

    // Complete update promises to DB
    await queryInterface.bulkInsert('chartParams', params);

    // // Remove params values from config object
    await queryInterface.sequelize.query('UPDATE charts SET config = JSON_REMOVE(config, "$.params");');

    return;
  },
};
