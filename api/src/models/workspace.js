const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const workspace = sequelize.define(
    'workspace',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      directory: DataTypes.JSON,
      directoryDepth: DataTypes.JSON,
      openDashboards: DataTypes.JSON,
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      deletedDate: DataTypes.DATE,
    },
    { charset: 'utf8', collate: 'utf8_general_ci', timestamps: false },
  );

  workspace.associate = ({ user }) => {
    // One-to-One relation between dashboards and clusters
    // Creates 'clusterID' foreign key on dashboard model
    workspace.belongsTo(user, {
      foreignKey: { name: 'userID', allowNull: false },
      onDelete: 'cascade',
    });
  };

  return workspace;
};
