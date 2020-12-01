'use strict';

const addUserIdFkConstraint = tableName => ({
  fields: ['userID'],
  type: 'foreign key',
  name: `${tableName}_ibfk_2`,
  references: {
    table: 'users',
    field: 'id',
  },
  onDelete: 'cascade',
});

module.exports = {
  up: async (queryInterface, DataTypes) => {
    // Remove existing userID FK constraint
    await queryInterface.removeConstraint('clusterAuth', 'clusterAuth_ibfk_2');
    await queryInterface.removeConstraint('dashboardPermissions', 'dashboardPermissions_ibfk_2');
    await queryInterface.removeConstraint('workspaces', 'workspaces_ibfk_1');

    // Add columns and add unique email constraint
    await queryInterface.addColumn('users', 'authServiceID', DataTypes.INTEGER);
    await queryInterface.sequelize.query('UPDATE users SET authServiceID=id;');
    await queryInterface.changeColumn('users', 'id', {
      type: DataTypes.INTEGER,
      autoIncrement: true,
    });
    await queryInterface.addColumn('users', 'email', DataTypes.STRING);
    await queryInterface.addConstraint('users', {
      fields: ['email'],
      type: 'unique',
      name: 'user_email',
    });

    // Re-add userID FK constraint but enable cascade on update
    await queryInterface.addConstraint('clusterAuth', {
      ...addUserIdFkConstraint('clusterAuth'),
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('dashboardPermissions', {
      ...addUserIdFkConstraint('dashboardPermissions'),
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('workspaces', {
      ...addUserIdFkConstraint('workspaces'),
      name: 'workspaces_ibfk_1',
      onUpdate: 'cascade',
    });
  },

  down: async (queryInterface, DataTypes) => {
    // Remove constraint that permits userID cascade on update
    await queryInterface.removeConstraint('workspaces', 'workspaces_ibfk_1');
    await queryInterface.removeConstraint('dashboardPermissions', 'dashboardPermissions_ibfk_2');
    await queryInterface.removeConstraint('clusterAuth', 'clusterAuth_ibfk_2');

    // Remove unique email constraint and remove new columns
    await queryInterface.removeConstraint('users', 'user_email');
    await queryInterface.removeColumn('users', 'email');
    await queryInterface.changeColumn('users', 'id', {
      type: DataTypes.INTEGER,
      autoIncrement: false,
    });
    await queryInterface.sequelize.query('UPDATE users SET id=authServiceID;');
    await queryInterface.removeColumn('users', 'authServiceID');

    // Add original userID constraints
    await queryInterface.addConstraint('workspaces', {
      ...addUserIdFkConstraint('workspaces'),
      name: 'workspaces_ibfk_1',
    });
    await queryInterface.addConstraint('dashboardPermissions', addUserIdFkConstraint('dashboardPermissions'));
    await queryInterface.addConstraint('clusterAuth', addUserIdFkConstraint('clusterAuth'));
  },
};
