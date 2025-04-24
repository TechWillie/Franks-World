'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Chat_Room_Members', [
      { user_Id: 1, chat_Room_Id: 1, createdAt: new Date()},
      { user_Id: 2, chat_Room_Id: 2, createdAt: new Date()},
      { user_Id: 3, chat_Room_Id: 3, createdAt: new Date()},
      { user_Id: 4, chat_Room_Id: 4, createdAt: new Date()}
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Chat_Room_Members');
  }
};
