// Misc. functions to separate reused code to keep files DRY

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

  // Query has no defined params
  if (keys.length === 0) {
    return '';
  }

  const urlString = keys.map((key, index) => {
    // Create 'key=value'
    let param = `${key}=${params[key]}`;

    // If this is not the last parameter, add an '&'
    if (index !== params.length - 1) {
      param = `${param}&`;
    }

    return param;
  });

  return urlString;
};

const findQueryResultsObj = response => {
  const nestedKeys = Object.keys(response);
  const data = response[nestedKeys[0]].Row;

  if (response[nestedKeys[0]].Row == undefined) {
    return false;
  }

  return data;
};

const sortByKey = (array, key) => {
  const data = array.sort((a, b) => {
    const aKey = typeof a[key] === 'string' ? a[key].trim().toLowerCase() : a[key];
    const bKey = typeof b[key] === 'string' ? b[key].trim().toLowerCase() : b[key];

    return aKey < bKey ? -1 : aKey > bKey ? 1 : 0;
  });

  return data;
};

module.exports = { findQueryResultsObj, getFieldType, getParamsString, sortByKey };
