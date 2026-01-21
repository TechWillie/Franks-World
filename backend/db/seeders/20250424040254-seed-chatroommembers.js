'use strict';

let options = { tableName: 'ChatRoomMembers' };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(options, [
      { userId: 1, chatRoomId: 1, createdAt: new Date()},
      { userId: 2, chatRoomId: 2, createdAt: new Date()},
      { userId: 3, chatRoomId: 3, createdAt: new Date()},
      { userId: 4, chatRoomId: 4, createdAt: new Date()}
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete(options, null, {});
  }
};
