'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Messages', [
      { user_Id: 1, chat_Room_Id: 1, content: 'Hey everyone!', createdAt: new Date(), updatedAt: new Date() },
      { user_Id: 2, chat_Room_Id: 2, content: 'Ready to plan our trip?', createdAt: new Date(), updatedAt: new Date() },
      { user_Id: 3, chat_Room_Id: 3, content: 'What game are we playing tonight?', createdAt: new Date(), updatedAt: new Date() },
      { user_Id: 4, chat_Room_Id: 4, content: 'Who’s cooking today?', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Messages');
  }
};
