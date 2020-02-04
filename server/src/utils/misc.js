// Misc. functions to separate reused code to keep files DRY

const getFieldType = value => {
  let type;

  // Identify field type based on value
  type =
    isNaN(value) === false
      ? 'number'
      : value == true || value == false
      ? 'boolean'
      : value.toLowerCase();

  return type;
};

module.exports = { getFieldType };
