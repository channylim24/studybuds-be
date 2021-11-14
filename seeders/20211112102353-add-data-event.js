'use strict';
const faker = require('faker')
const moment = require('moment')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (let i = 1; i <= 10; i++) {
      await queryInterface.bulkInsert('events', [
        {
          id_user: Math.floor(Math.random() * 10) + 1,
          id_category: Math.floor(Math.random() * 8) + 1,
          id_speaker: Math.floor(Math.random() * 10) + 1,
          title: faker.commerce.department(),
          imageEvent: faker.image.imageUrl(),
          detail: faker.lorem.sentence(),
          dateStart: moment().format('MM-DD-YYYY hh:mm'),
          dateEnd: moment().format('MM-DD-YYYY hh:mm'),
          organizer: faker.company.companyName(),
          link: faker.image.imageUrl(),
          createdAt: new Date(),
          updatedAt: new Date()
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
    await queryInterface.bulkDelete('events', null, {});
  }
};
