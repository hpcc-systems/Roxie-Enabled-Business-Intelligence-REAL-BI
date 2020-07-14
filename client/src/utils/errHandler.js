const errHandler = err => {
  const { data, status } = err.response;

  // Remove before deploying to production
  console.error(data, status);

  return { errMsg: data, status };
};

export default errHandler;
