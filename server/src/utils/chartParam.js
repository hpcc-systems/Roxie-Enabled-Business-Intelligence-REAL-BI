// DB Models
const { chartParam: chartParamModel } = require('../models');

// Utils
const { awaitHandler, unNestSequelizeObj } = require('./misc');

const createChartParams = async (sourceID, { params }, chartID) => {
  // Create array of promises
  const promises = params.map(({ dataset, value, ...otherKeys }) => {
    // Don't save the param value if the value is an empty string
    if (value === '') {
      value = null;
    }

    // Don't save the dataset value if it is an empty string
    if (dataset === '') {
      dataset = null;
    }

    return chartParamModel.create({ ...otherKeys, dataset, chartID, sourceID, value });
  });

  // Loop through and execute promises, throw any errors
  for (const promise of promises) {
    let [err] = await awaitHandler(promise);

    // Return error
    if (err) throw err;
  }

  return;
};

const findAllChartParams = async chartID => {
  let [err, params] = await awaitHandler(
    chartParamModel.findAll({
      attributes: { exclude: ['chartID'] },
      where: { chartID },
    }),
  );

  // Return error
  if (err) throw err;

  // Create array of flattened objects
  params = params.map(param => unNestSequelizeObj(param));

  return params;
};

const updateChartParam = async (id, value) => {
  // Don't save the param value if it is an empty string
  if (value === '') {
    value = null;
  }

  let [err] = await awaitHandler(chartParamModel.update({ value }, { where: { id } }));

  // Return error
  if (err) throw err;

  return;
};

module.exports = { createChartParams, findAllChartParams, updateChartParam };
