'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Events', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      placeId: {
        type: Sequelize.INTEGER,
        references: { model: 'Places', key: 'id' },
        onDelete: 'SET NULL'
      },
      hostId: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL'
      },
      chatRoomId: {
        type: Sequelize.INTEGER,
        references: { model: 'ChatRooms', key: 'id' },
        onDelete: 'SET NULL'
      },
      description: Sequelize.TEXT,
      eventDate: {
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
    options.tableName = 'Events';
    await queryInterface.dropTable(options);
  }
};
