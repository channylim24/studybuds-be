'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (let i = 0; i <= 10; i++) {
      await queryInterface.bulkInsert('speakers', [
        {
          name: faker.name.findName(),
          speakerPhoto: faker.image.imageUrl(),
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
