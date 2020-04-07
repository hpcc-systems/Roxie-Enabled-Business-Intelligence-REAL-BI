// DB Models
const { queryParam: queryParamModel } = require('../models');

// Utils
const { awaitHandler, unNestSequelizeObj } = require('./misc');

const createQueryParams = async (queryID, { params }, dashboardID, chartID) => {
  let field = 'dashboardID';
  let id = dashboardID;

  // chartID was provided instead of dashboardID
  if (chartID) {
    field = 'chartID';
    id = chartID;
  }

  // Create array of promises
  const promises = params.map(({ dataset, value, ...otherKeys }) => {
    // Don't save the param value if it is a dashboard param or if the value is an empty string
    if (dashboardID || value === '') {
      value = null;
    }

    // Don't save the dataset value if it is an empty string
    if (dataset === '') {
      dataset = null;
    }

    return queryParamModel.create({ ...otherKeys, dataset, [field]: id, queryID, value });
  });

  for (const promise of promises) {
    let [err] = await awaitHandler(promise);

    // Return error
    if (err) throw err;
  }

  return;
};

const findAllQueryParams = async (dashboardID, chartID) => {
  let field = 'dashboardID';
  let id = dashboardID;

  // chartID was provided instead of dashboardID
  if (chartID) {
    field = 'chartID';
    id = chartID;
  }

  let [err, params] = await awaitHandler(
    queryParamModel.findAll({
      attributes: { exclude: ['chartID', 'dashboardID'] },
      where: { [field]: id },
    }),
  );

  // Return error
  if (err) throw err;

  // Create array of flattened objects
  params = params.map(param => unNestSequelizeObj(param));

  return params;
};

const updateQueryParam = async (id, value) => {
  // Don't save the param value if it is an empty string
  if (value === '') {
    value = null;
  }

  let [err] = await awaitHandler(queryParamModel.update({ value }, { where: { id } }));

  // Return error
  if (err) throw err;

  return;
};

module.exports = { createQueryParams, findAllQueryParams, updateQueryParam };
