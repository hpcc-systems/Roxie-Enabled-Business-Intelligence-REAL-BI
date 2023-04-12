'use strict';

const { chart: Chart } = require('../models');

module.exports = {
  up: async (queryInterface, { Op }) => {
    const charts = await Chart.findAll(
      { where: { configuration: { [Op.substring]: 'table' } } },
      { paranoid: false },
    );

    for await (const chart of charts) {
      const { fields } = chart.configuration;
      const updatedFields = fields.map(field => ({ label: '', name: field }));
      await chart.update(
        { configuration: { ...chart.configuration, fields: updatedFields } },
        { paranoid: false },
      );
    }
  },

  down: async (queryInterface, { Op }) => {
    const charts = await Chart.findAll(
      { where: { configuration: { [Op.substring]: 'table' } } },
      { paranoid: false },
    );

    for await (const chart of charts) {
      const { fields } = chart.configuration;
      const updatedFields = fields.map(({ name }) => name);

      await chart.update(
        { configuration: { ...chart.configuration, fields: updatedFields } },
        { paranoid: false },
      );
    }
  },
};
