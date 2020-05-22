export const sortArr = (arr, field = '', order = 'asc') => {
  if (!field) return arr;

  arr.sort((a, b) => {
    let aField = a[field] == null ? '' : a[field];
    let bField = b[field] == null ? '' : b[field];

    // Format value
    aField = isNaN(Number(aField)) ? aField.trim().toLowerCase() : Number(aField);
    bField = isNaN(Number(bField)) ? bField.trim().toLowerCase() : Number(bField);

    // Sort value
    let value = 0;

    if (aField < bField) {
      value = -1;
    } else if (aField > bField) {
      value = 1;
    } else {
      value = 0;
    }

    if (order === 'desc' && value !== 0) {
      value = -value;
    }

    return value;
  });

  return arr;
};
