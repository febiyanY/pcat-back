'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Days', [
      {id: 0,name: 'Sunday'},
      {id: 1,name: 'Monday'},
      {id: 2,name: 'Tuesday'},
      {id: 3,name: 'Wednesday'},
      {id: 4,name: 'Thursday'},
      {id: 5,name: 'Friday'},
      {id: 6,name: 'Saturday'}
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Days', null, {})
  }
};
