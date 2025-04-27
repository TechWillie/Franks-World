'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('EventAttendees', [
      { userId: 1, eventId: 1, createdAt: new Date(), updatedAt: new Date() },
      { userId: 2, eventId: 2, createdAt: new Date(), updatedAt: new Date() },
      { userId: 3, eventId: 3, createdAt: new Date(), updatedAt: new Date() },
      { userId: 4, eventId: 4, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('EventAttendees');
  }
};
