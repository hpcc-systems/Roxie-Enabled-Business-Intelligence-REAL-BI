export const validateSource = (state, eclRef) => {
  let errors = [];

  switch (state.sourceType) {
    case 'ecl':
      if (!eclRef.current.schema) {
        errors.push({ eclRef: 'Enter and execute desired ECL' });
      }
      break;
    case 'file':
      if (!state.selectedSource.cluster) {
        errors.push({ selectedSource: 'Search for and select a logical file' });
      }
      break;
    case 'query':
    default:
      if (!state.selectedSource.cluster) {
        errors.push({ selectedSource: 'Search for and select a Roxie query' });
      }
      if (!state.selectedDataset.name) {
        errors.push({ selectedDataset: 'Select a dataset' });
      }
      break;
  }

  return errors;
};
