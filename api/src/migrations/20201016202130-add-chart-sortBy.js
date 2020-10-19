'use strict';

const { chart: chartModel, dashboard: dashboardModel, sequelize } = require('../models');
const { awaitHandler, unNestSequelizeObj } = require('../utils/misc');

module.exports = {
  up: async queryInterface => {
    // Get all dashboards in DB
    let [, dashboards] = await awaitHandler(dashboardModel.findAll());
    dashboards = dashboards.map(dashboard => unNestSequelizeObj(dashboard));

    // loop through dashboards
    const promises = dashboards.map(async ({ id: dashboardID }) => {
      // Get charts for dashboard
      let charts = await queryInterface.sequelize.query(
        `SELECT id, config FROM charts WHERE dashboardID = "${dashboardID}";`,
        { raw: true, type: sequelize.QueryTypes.SELECT },
      );

      return charts.map(({ config, id }, index) => {
        const newConfig = { ...config, sort: index };
        return chartModel.update({ config: newConfig }, { where: { id } });
      });
    });

    // Complete update promises to DB
    await Promise.all(promises);
  },

  down: async queryInterface => {
    // Remove sort value from config
    await queryInterface.sequelize.query(
      `UPDATE charts
       SET
         config = JSON_REMOVE(config, "$.sort");
      `,
    );

    return;
  },
};
