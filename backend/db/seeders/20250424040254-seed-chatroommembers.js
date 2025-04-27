'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('ChatRoomMembers', [
      { userId: 1, chatRoomId: 1, createdAt: new Date()},
      { userId: 2, chatRoomId: 2, createdAt: new Date()},
      { userId: 3, chatRoomId: 3, createdAt: new Date()},
      { userId: 4, chatRoomId: 4, createdAt: new Date()}
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('ChatRoomMembers');
  }
};
