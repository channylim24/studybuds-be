'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      eventPhoto: {
        allowNull: false,
        type: Sequelize.STRING
      },
      detail: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dateStart: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dateEnd: {
        allowNull: false,
        type: Sequelize.STRING
      },
      organizer: {
        allowNull: false,
        type: Sequelize.STRING
      },
      link: {
        allowNull: false,
        type: Sequelize.STRING
      },
      id_user: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      id_category: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'categories',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      id_speaker: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'speakers',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('events');
  }
};