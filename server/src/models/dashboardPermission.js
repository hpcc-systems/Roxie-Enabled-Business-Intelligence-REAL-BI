module.exports = (sequelize, DataTypes) => {
  const dashboardPermission = sequelize.define(
    'dashboardPermission',
    {
      role: DataTypes.STRING,
    },
    { charset: 'utf8', collate: 'utf8_general_ci', timestamps: false },
  );

  return dashboardPermission;
};
