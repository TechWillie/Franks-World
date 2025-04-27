'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Media', [
      { id: 1, url: 'https://example.com/photo1.jpg', type: 'image', userId: 1, eventId: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, url: 'https://example.com/photo2.jpg', type: 'image', userId: 2, eventId: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, url: 'https://example.com/video1.mp4', type: 'video', userId: 3, eventId: 3, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, url: 'https://example.com/video2.mp4', type: 'video', userId: 4, eventId: 4, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Media');
  }
};
