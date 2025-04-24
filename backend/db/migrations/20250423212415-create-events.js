'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('events', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      place_id: {
        type: Sequelize.INTEGER,
        references: { model: 'places', key: 'id' },
        onDelete: 'SET NULL'
      },
      host_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL'
      },
      chat_room_id: {
        type: Sequelize.INTEGER,
        references: { model: 'chat_rooms', key: 'id' },
        onDelete: 'SET NULL'
      },
      description: Sequelize.TEXT,
      event_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'events';
    await queryInterface.dropTable(options);
  }
};
