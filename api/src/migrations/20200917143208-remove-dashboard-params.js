'use strict';

const { v4: uuidv4 } = require('uuid');
const { dashboard: dashboardModel, sequelize } = require('../models');
const { awaitHandler, unNestSequelizeObj } = require('../utils/misc');

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('dashboards', 'filters', { type: DataTypes.JSON });

    // Get all dashboards in DB
    let [, dashboards] = await awaitHandler(dashboardModel.findAll());
    dashboards = dashboards.map(dashboard => unNestSequelizeObj(dashboard));

    // loop through dashboards
    const promises = dashboards.map(async ({ id: dashboardID }) => {
      // Get params for dashboard
      let filters = await queryInterface.sequelize.query(
        `SELECT dataset, field, mappedParams, name, sourceID, value FROM dashboardParams WHERE dashboardID = "${dashboardID}";`,
        { raw: true, type: sequelize.QueryTypes.SELECT },
      );

      // Get array of filters
      filters = filters.map(filter => {
        const { dataset, field, mappedParams = [], name, sourceID, value } = filter;

        // Reformat mappedParams
        const params = mappedParams.map(({ chartID, parameter }) => {
          return { targetChart: chartID, targetParam: parameter };
        });

        const newFilter = {
          ecl: {},
          name,
          params,
          sourceID,
          sourceDataset: dataset,
          sourceField: field,
          value,
        };

        return newFilter;
      });

      // Return promise to update database filters object containing params
      return dashboardModel.update({ filters }, { where: { id: dashboardID } });
    });

    // Complete update promises to DB
    await Promise.all(promises);

    return queryInterface.dropTable('dashboardParams');
  },

  down: async (queryInterface, DataTypes) => {
    // Create dashboardParams table
    await queryInterface.createTable('dashboardParams', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: DataTypes.TEXT,
      dataset: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      field: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mappedParams: DataTypes.JSON,
      sourceID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'sources',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      dashboardID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'dashboards',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });

    // Get all dashboards in DB
    let [, dashboards] = await awaitHandler(dashboardModel.findAll());
    dashboards = dashboards.map(dashboard => unNestSequelizeObj(dashboard));

    let newDashboardParams = [];

    // loop through dashboards
    dashboards.forEach(({ id: dashboardID, filters = [] }) => {
      // Loop through config.params array
      return filters.forEach(filter => {
        const { name, params = [], sourceID, sourceDataset, sourceField, value } = filter;

        const mappedParams = params.map(param => {
          const { targetChart, targetParam } = param;

          return { chartID: targetChart, parameter: targetParam, sourceID };
        });

        const newDashboardParam = {
          name,
          mappedParams: JSON.stringify(mappedParams),
          sourceID,
          dataset: sourceDataset,
          field: sourceField,
          value,
          dashboardID,
        };

        // Create a row for each param object in array
        return newDashboardParams.push({ id: uuidv4(), ...newDashboardParam });
      });
    });

    // Complete update promises to DB
    if (newDashboardParams.length > 0) {
      await queryInterface.bulkInsert('dashboardParams', newDashboardParams);
    }

    // Remove params values from config object
    await queryInterface.removeColumn('dashboards', 'filters');

    return;
  },
};
