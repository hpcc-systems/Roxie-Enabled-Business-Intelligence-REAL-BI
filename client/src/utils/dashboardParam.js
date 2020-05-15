const createParamObj = (localState, dashboardID) => {
  const { dataset, field, mappedParams, name } = localState;

  return { dataset, field, mappedParams, name, dashboardID };
};

const setEditorState = (filters, filterID) => {
  // Get desired filter
  const { id, queryName, ...filterVals } = filters.find(({ id }) => id === filterID);

  // Create initial state object
  let initState = {
    filterID: id,
    datasets: [],
    keyword: queryName,
    queries: [],
    query: '',
    ...filterVals,
  };

  return initState;
};

export { createParamObj, setEditorState };
