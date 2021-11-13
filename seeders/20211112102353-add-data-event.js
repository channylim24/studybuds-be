'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('events', [
      {
        id_user: 1,
        id_category: 1,
        id_speaker: 1,
        title: faker.commerce.department(),
        imageEvent: faker.image.imageUrl(),
        detail: faker.lorem.sentence(),
        dateStart: new Date(),
        dateEnd: new Date(),
        organizer: faker.company.companyName(),
        link: faker.image.imageUrl(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_user: 2,
        id_category: 2,
        id_speaker: 2,
        title: faker.commerce.department(),
        imageEvent: faker.image.imageUrl(),
        detail: faker.lorem.sentence(),
        dateStart: new Date(),
        dateEnd: new Date(),
        organizer: faker.company.companyName(),
        link: faker.image.imageUrl(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_user: 3,
        id_category: 3,
        id_speaker: 3,
        title: faker.commerce.department(),
        imageEvent: faker.image.imageUrl(),
        detail: faker.lorem.sentence(),
        dateStart: new Date(),
        dateEnd: new Date(),
        organizer: faker.company.companyName(),
        link: faker.image.imageUrl(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_user: 4,
        id_category: 4,
        id_speaker: 4,
        title: faker.commerce.department(),
        imageEvent: faker.image.imageUrl(),
        detail: faker.lorem.sentence(),
        dateStart: new Date(),
        dateEnd: new Date(),
        organizer: faker.company.companyName(),
        link: faker.image.imageUrl(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_user: 5,
        id_category: 5,
        id_speaker: 5,
        title: faker.commerce.department(),
        imageEvent: faker.image.imageUrl(),
        detail: faker.lorem.sentence(),
        dateStart: new Date(),
        dateEnd: new Date(),
        organizer: faker.company.companyName(),
        link: faker.image.imageUrl(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
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
