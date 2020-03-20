// DB Models
const { dashboard: dashboardModel, query: queryModel } = require('../models');

// Utils
const { unNestSequelizeObj } = require('./misc');

const createQuery = async query => {
  let newQuery;

  try {
    newQuery = await queryModel.create(query);
  } catch (err) {
    throw err;
  }

  // Get nested object
  newQuery = unNestSequelizeObj(newQuery);

  return newQuery;
};

const getQueriesByDashboard = async dashboardID => {
  let queries;

  try {
    queries = await queryModel.findAll({
      include: { model: dashboardModel, attributes: [], where: { id: dashboardID } },
    });
  } catch (err) {
    throw err;
  }

  return queries;
};

const getQueryByHpccID = async ({ hpccID }) => {
  let query;

  try {
    query = await queryModel.findOne({ where: { hpccID } });
  } catch (err) {
    throw err;
  }

  if (!query) {
    return;
  }

  // Get nested object
  query = unNestSequelizeObj(query);

  return query;
};

const getQueryByID = async queryID => {
  let query;

  try {
    query = await queryModel.findOne({ where: { id: queryID } });
  } catch (err) {
    throw err;
  }

  // Get nested object
  query = unNestSequelizeObj(query);

  return query;
};

const getQueriesByDashboardID = async dashboardID => {
  let dashboard, queries;

  try {
    dashboard = await dashboardModel.findOne({
      attributes: [],
      where: { id: dashboardID },
      include: { model: queryModel },
    });
  } catch (err) {
    throw err;
  }

  // Get nested objects
  dashboard = unNestSequelizeObj(dashboard);
  queries = dashboard.queries.map(query => {
    // Get nested object
    query = unNestSequelizeObj(query);

    // Remove unnecessay key
    delete query.dashboardSource;

    return query;
  });

  return queries;
};

module.exports = {
  createQuery,
  getQueriesByDashboard,
  getQueriesByDashboardID,
  getQueryByHpccID,
  getQueryByID,
};
