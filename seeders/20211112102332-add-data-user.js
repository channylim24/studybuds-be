'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {

    for (let i = 0; i <= 10; i++) {
      await queryInterface.bulkInsert('users', [
        {
          avatar: faker.image.imageUrl(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ], {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
