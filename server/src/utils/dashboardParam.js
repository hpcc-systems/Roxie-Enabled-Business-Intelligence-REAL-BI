// DB Models
const { dashboardParam: dashboardParamModel } = require('../models');

// Utils
const { awaitHandler, unNestSequelizeObj } = require('./misc');

const createDashboardParam = async dashboardParamObj => {
  let [err, param] = await awaitHandler(dashboardParamModel.create({ ...dashboardParamObj }));

  // Return error
  if (err) throw err;

  // Unnest data
  param = unNestSequelizeObj(param);

  return param;
};

const getDashboardParams = async dashboardID => {
  let [err, params] = await awaitHandler(dashboardParamModel.findAll({ where: { dashboardID } }));

  // Return error
  if (err) throw err;

  // Unnest data
  params = params.map(param => unNestSequelizeObj(param));

  return params;
};

const updateDashboardParam = async dashboardParamObj => {
  const { id } = dashboardParamObj;
  let { value } = dashboardParamObj;

  // Don't save empty string
  if (value === '') {
    value = null;
  }

  let [err] = await awaitHandler(
    dashboardParamModel.update({ ...dashboardParamObj, value }, { where: { id } }),
  );

  // Return error
  if (err) throw err;

  return;
};

module.exports = { createDashboardParam, getDashboardParams, updateDashboardParam };
