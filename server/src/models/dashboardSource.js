module.exports = sequelize => {
  const dashboardSource = sequelize.define(
    'dashboardSource',
    {},
    { charset: 'utf8', collate: 'utf8_general_ci', timestamps: false },
  );

  return dashboardSource;
};
