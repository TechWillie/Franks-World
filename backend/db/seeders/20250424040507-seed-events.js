'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Events', [
      { name: 'Picnic Day', event_date: '2025-05-15', place_Id: 1, host_Id: 1, chat_Room_Id: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Photo Walk', event_date: '2025-06-01', place_Id: 2, host_Id: 2, chat_Room_Id: 2, createdAt: new Date(), updatedAt: new Date() },
      { name: 'LAN Party', event_date: '2025-06-20', place_Id: 3, host_Id: 3, chat_Room_Id: 3, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Food Festival', event_date: '2025-07-10', place_Id: 4, host_Id: 4, chat_Room_Id: 4, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Events');
  }
};
