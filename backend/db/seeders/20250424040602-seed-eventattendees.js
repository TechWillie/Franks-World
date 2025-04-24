'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Event_Attendees', [
      { user_Id: 1, event_Id: 1, createdAt: new Date(), updatedAt: new Date() },
      { user_Id: 2, event_Id: 2, createdAt: new Date(), updatedAt: new Date() },
      { user_Id: 3, event_Id: 3, createdAt: new Date(), updatedAt: new Date() },
      { user_Id: 4, event_Id: 4, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Event_Attendees');
  }
};
