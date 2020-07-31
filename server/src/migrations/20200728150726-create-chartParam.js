'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('chartParams', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      dataset: DataTypes.STRING,
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: DataTypes.STRING,
      sourceID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'sources',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      chartID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'charts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('chartParams');
  },
};
