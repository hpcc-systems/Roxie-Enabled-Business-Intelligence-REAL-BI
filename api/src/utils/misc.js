const getValueType = (value = '') => {
  const type =
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

module.exports = { getValueType };
