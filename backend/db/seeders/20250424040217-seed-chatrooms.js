'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Chat_Rooms', [
      { name: 'General', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Travel Buddies', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Gamers Unite', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Foodies Chat', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Chat_Rooms');
  }
};
