'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      username: 'admin',
      name: 'Adminnnn',
      password: '$2b$10$oK6oM9QQdhqjVsSXWxhaM.xn3N4B/nQa4SMVLMaTnkJh2eqG7BKpi',
      type: 'admin'
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
