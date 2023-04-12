'use strict';

const { Op } = require('sequelize');
const { tableNames } = require('../constants');
const { dashboard_filter: DashboardFilter } = require('../models');
const { createFKField } = require('../utils/sequelize');

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.changeColumn(tableNames.dashboardFilter, 'sourceID', createFKField(DataTypes, true));

    // Add missing type to any existing filters
    const filters = await DashboardFilter.findAll({ paranoid: false });
    for await (const filter of filters) {
      await filter.update(
        { configuration: { ...filter.configuration, type: 'valuesDropdown' } },
        { paranoid: false },
      );
    }
  },

  down: async (queryInterface, DataTypes) => {
    /*
      Delete any dateRange filters since the sourceID will be null and
      cause an error when trying to change the sourceID field to required
    */
    await DashboardFilter.destroy({
      where: { [Op.or]: [{ 'configuration.type': 'dateRange' }, { 'configuration.type': 'dateField' }] },
      force: true,
      nested: true,
    });

    await queryInterface.changeColumn(tableNames.dashboardFilter, 'sourceID', createFKField(DataTypes));
  },
};
