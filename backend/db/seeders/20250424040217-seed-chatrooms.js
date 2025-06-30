'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('ChatRooms', [
      { id: 1, name: 'General', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Travel Buddies', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Gamers Unite', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'Foodies Chat', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('ChatRooms');
  }
};
