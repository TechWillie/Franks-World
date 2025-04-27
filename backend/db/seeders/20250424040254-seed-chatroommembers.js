'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('ChatRoomMembers', [
      { id: 1, userId: 1, chatRoomId: 1, createdAt: new Date()},
      { id: 2, userId: 2, chatRoomId: 2, createdAt: new Date()},
      { id: 3, userId: 3, chatRoomId: 3, createdAt: new Date()},
      { id: 4, userId: 4, chatRoomId: 4, createdAt: new Date()}
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('ChatRoomMembers');
  }
};
