'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('bookmarks', [
      {
        id_user: 1,
        id_event: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_user: 2,
        id_event: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_user: 3,
        id_event: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_user: 4,
        id_event: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_user: 5,
        id_event: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
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
