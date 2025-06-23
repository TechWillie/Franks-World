'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Media', [
      { url: 'https://picsum.photos/200/300', type: 'image', userId: 1, eventId: 1, createdAt: new Date(), updatedAt: new Date() },
      { url: 'https://picsum.photos/200/300', type: 'image', userId: 2, eventId: 2, createdAt: new Date(), updatedAt: new Date() },
      { url: 'https://picsum.photos/200/300', type: 'video', userId: 3, eventId: 3, createdAt: new Date(), updatedAt: new Date() },
      { url: 'https://picsum.photos/200/300', type: 'video', userId: 4, eventId: 4, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Media');
  }
};
