'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    await queryInterface.addConstraint('Schedules', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'custom_fkey_constraint_user_id',
      references: { //Required field
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('Schedules', {
      fields: ['day_id'],
      type: 'foreign key',
      name: 'custom_fkey_constraint_day_id',
      references: { //Required field
        table: 'Days',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });

    await queryInterface.addColumn('Attendances', 'user_id', {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'Users'
        },
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    })
    await queryInterface.addColumn('Attendances', 'day_id', {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'Days'
        },
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    })

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Schedules','custom_fkey_constraint_user_id')
    await queryInterface.removeConstraint('Schedules','custom_fkey_constraint_day_id')
    await queryInterface.removeConstraint('Attendances','day_id')
    await queryInterface.removeConstraint('Attendances','user_id')
  }
};
