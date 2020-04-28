// Misc. functions to separate reused code to keep files DRY
const qs = require('qs');

const getType = (value = '') => {
  // Necessary ternary because default parameter value above is not applied to "null"
  value = value || '';

  let type;

  // Identify field type based on value
  type =
    isNaN(value) === false
      ? 'number'
      : value == true || value == false
      ? 'boolean'
      : Array.isArray(value) === true
      ? 'array'
      : typeof value === 'object'
      ? 'object'
      : value.trim().toLowerCase();

  return type;
};

const createParamString = (params = []) => {
  // Necessary ternary because default parameter value above is not applied to "null"
  params = params || [];

  let urlString = '';

  // Query has no defined params
  if (params.length === 0) return urlString;

  params.forEach(({ name, value }) => {
    if (!value) return;

    urlString += qs.stringify({ [name]: value }, { encodeValuesOnly: true });
  });

  return `?${urlString}`;
};

const findQueryDatasets = (responseObj = {}) => {
  // Necessary ternary because default parameter value above is not applied to "null"
  responseObj = responseObj || {};

  const keys = Object.keys(responseObj);

  return keys;
};

const getDatasetFields = (dataset = []) => {
  // Necessary ternary because default parameter value above is not applied to "null"
  dataset = dataset || [];

  let fields = [];

  // Loop through dataset array
  dataset.forEach(datasetObj => {
    // For each dataset, loop through keys
    fields = Object.keys(datasetObj).map(key => {
      // Get value of nested object key
      const value = datasetObj[key];

      return { name: key, type: getType(value) };
    });
  });

  return fields;
};

const unNestSequelizeObj = (sequelizeObj = {}) => {
  // Necessary ternary because default parameter value above is not applied to "null"
  sequelizeObj = sequelizeObj || {};

  // Empty object provided
  if (Object.keys(sequelizeObj).length === 0) {
    return sequelizeObj;
  }

  // Provided object doesn't contain nested dataValues object
  if (!sequelizeObj.dataValues) {
    return sequelizeObj;
  }

  return sequelizeObj.dataValues;
};

const awaitHandler = promise => {
  return promise.then(data => [null, data]).catch(err => [err]);
};

module.exports = {
  awaitHandler,
  createParamString,
  findQueryDatasets,
  getDatasetFields,
  getType,
  unNestSequelizeObj,
};
