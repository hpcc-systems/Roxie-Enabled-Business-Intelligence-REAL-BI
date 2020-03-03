module.exports = (sequelize, DataTypes) => {
  const query = sequelize.define(
    'query',
    {
      hpccID: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      target: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    { charset: 'utf8', collate: 'utf8_general_ci', timestamps: false },
  );

  query.associate = ({ dashboard, dashboardSource }) => {
    // Many-to-Many relation between queries and dashboards
    // Creates 'queryID' foreign key on dashboardSource model
    query.belongsToMany(dashboard, {
      through: dashboardSource,
      foreignKey: { name: 'queryID', allowNull: false },
      onDelete: 'cascade',
    });
  };

  return query;
};
