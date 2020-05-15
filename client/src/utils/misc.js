const sortArr = (a, b, field) => {
  let aField = a[field];
  let bField = b[field];

  // Format value
  aField = isNaN(Number(aField)) ? aField.trim().toLowerCase() : Number(aField);
  bField = isNaN(Number(bField)) ? bField.trim().toLowerCase() : Number(bField);

  if (aField < bField) {
    return -1;
  } else if (aField > bField) {
    return 1;
  }

  return 0;
};

export { sortArr };
