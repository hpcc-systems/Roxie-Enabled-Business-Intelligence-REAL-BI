// DB Models
const { dashboard: dashboardModel, query: queryModel } = require('../models');

// Utils
const { awaitHandler, unNestSequelizeObj } = require('./misc');

const createQuery = async query => {
  let [err, newQuery] = await awaitHandler(queryModel.create(query));

  // Return error
  if (err) throw err;

  // Get nested object
  newQuery = unNestSequelizeObj(newQuery);

  return newQuery;
};

const getQueriesByDashboard = async dashboardID => {
  let [err, queries] = await awaitHandler(
    queryModel.findAll({
      include: { model: dashboardModel, attributes: [], where: { id: dashboardID } },
    }),
  );

  // Return error
  if (err) throw err;

  return queries;
};

const getQueryByHpccID = async ({ hpccID }) => {
  let [err, query] = await awaitHandler(queryModel.findOne({ where: { hpccID } }));

  // Return error
  if (err) throw err;

  if (!query) {
    return;
  }

  // Get nested object
  query = unNestSequelizeObj(query);

  return query;
};

const getQueryByID = async queryID => {
  let [err, query] = await awaitHandler(queryModel.findOne({ where: { id: queryID } }));

  // Return error
  if (err) throw err;

  // Get nested object
  query = unNestSequelizeObj(query);

  return query;
};

const getQueriesByDashboardID = async dashboardID => {
  let [err, dashboard] = await awaitHandler(
    dashboardModel.findOne({
      attributes: [],
      where: { id: dashboardID },
      include: { model: queryModel },
    }),
  );

  // Return error
  if (err) throw err;

  // Get nested objects
  dashboard = unNestSequelizeObj(dashboard);
  let queries = dashboard.queries.map(query => {
    // Get nested object
    query = unNestSequelizeObj(query);

    // Remove unnecessay key
    delete query.dashboardSource;

    return query;
  });

  return queries;
};

const deleteQueryByID = async queryID => {
  let [err] = await awaitHandler(queryModel.destroy({ where: { id: queryID } }));

  // Return error
  if (err) throw err;

  return;
};

module.exports = {
  createQuery,
  deleteQueryByID,
  getQueriesByDashboard,
  getQueriesByDashboardID,
  getQueryByHpccID,
  getQueryByID,
};
