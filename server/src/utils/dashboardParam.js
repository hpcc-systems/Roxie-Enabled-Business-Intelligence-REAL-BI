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

const getDashboardParamsByDashboardAndQueryID = async (dashboardID, queryID) => {
  let err, params;

  if (!dashboardID) {
    [err, params] = await awaitHandler(dashboardParamModel.findAll({ where: { queryID } }));
  } else {
    [err, params] = await awaitHandler(dashboardParamModel.findAll({ where: { dashboardID, queryID } }));
  }

  // Return error
  if (err) throw err;

  return params.length;
};

const updateDashboardParam = async dashboardParamObj => {
  const { filterID } = dashboardParamObj;
  let { id = filterID, value } = dashboardParamObj; // id is named filterID when editing the filter. Set id default to filterID

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

const deleteDashboardParam = async id => {
  let [err] = await awaitHandler(dashboardParamModel.destroy({ where: { id } }));

  // Return error
  if (err) throw err;

  return;
};

module.exports = {
  createDashboardParam,
  deleteDashboardParam,
  getDashboardParams,
  getDashboardParamsByDashboardAndQueryID,
  updateDashboardParam,
};
