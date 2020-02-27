// Misc. functions to separate reused code to keep files DRY

const setJSONField = (obj, key) => {
  let value = obj[key];

  // Format data structure
  value = !value ? {} : value;

  return value;
};

const getFieldType = value => {
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

const getParamsString = params => {
  const keys = Object.keys(params);
  let urlString = '';

  // Query has no defined params
  if (keys.length === 0) {
    return urlString;
  }

  urlString = keys.map((key, index) => {
    // Create 'key=value'
    let param = `${key}=${params[key]}`;

    // If this is not the last parameter, add an '&'
    if (index !== keys.length - 1) {
      param = `${param}&`;
    }

    return param;
  });

  // Convert array to string
  urlString = urlString.join('');

  return `?${urlString}`;
};

const findQueryDatasets = response => {
  const datasets = Object.keys(response);

  return datasets;
};

const findDatasetFields = datasetRow => {
  let fields = [];

  datasetRow.forEach((rowObj, index) => {
    const keys = Object.keys(rowObj);

    fields = keys.map(key => {
      // Get value of nested object key
      const value = datasetRow[index][key];

      return {
        name: key,
        type: getFieldType(value),
        checked: false, // Used by client
      };
    });
  });

  return fields;
};

module.exports = {
  findDatasetFields,
  findQueryDatasets,
  getFieldType,
  getParamsString,
  setJSONField,
};
