// DB Models
const { dashboardParam: dashboardParamModel } = require('../models');

// Utils
const { awaitHandler, unNestSequelizeObj } = require('./misc');

const createDashboardParam = async (dashboardParamObj, userID) => {
  let [err, param] = await awaitHandler(dashboardParamModel.create({ ...dashboardParamObj, userID }));

  // Return error
  if (err) throw err;

  // Unnest data
  param = unNestSequelizeObj(param);

  return param;
};

const getDashboardParams = async (dashboardID, userID) => {
  let [err, params] = await awaitHandler(dashboardParamModel.findAll({ where: { dashboardID, userID } }));

  // Return error
  if (err) throw err;

  // Unnest data
  params = params.map(param => unNestSequelizeObj(param));

  return params;
};

const getDashboardParamsByDashboardAndSourceID = async (dashboardID, sourceID) => {
  let err, params;

  if (!dashboardID) {
    [err, params] = await awaitHandler(dashboardParamModel.findAll({ where: { sourceID } }));
  } else {
    [err, params] = await awaitHandler(dashboardParamModel.findAll({ where: { dashboardID, sourceID } }));
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
  getDashboardParamsByDashboardAndSourceID,
  updateDashboardParam,
};
