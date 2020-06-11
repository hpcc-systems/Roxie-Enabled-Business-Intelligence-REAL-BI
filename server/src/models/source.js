const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const source = sequelize.define(
    'source',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      hpccID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      target: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'query',
      },
    },
    { charset: 'utf8', collate: 'utf8_general_ci', timestamps: false },
  );

  source.associate = ({ dashboard, dashboardSource }) => {
    // Many-to-Many relation between sources and dashboards
    // Creates 'sourceID' foreign key on dashboardSource model
    source.belongsToMany(dashboard, {
      through: dashboardSource,
      foreignKey: { name: 'sourceID', allowNull: false },
      onDelete: 'cascade',
    });
  };

  return source;
};
