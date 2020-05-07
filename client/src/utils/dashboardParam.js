const createParamObj = (localState, dashboardID) => {
  const { dataset, field, mappedParams, name } = localState;

  return { dataset, field, mappedParams, name, dashboardID };
};

export { createParamObj };
