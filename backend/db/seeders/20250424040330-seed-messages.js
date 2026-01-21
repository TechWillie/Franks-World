'use strict';

let options = { tableName: 'Messages' };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(options, [
      { userId: 1, chatRoomId: 1, content: 'Hey everyone!', createdAt: new Date(), updatedAt: new Date() },
      { userId: 2, chatRoomId: 2, content: 'Ready to plan our trip?', createdAt: new Date(), updatedAt: new Date() },
      { userId: 3, chatRoomId: 3, content: 'What game are we playing tonight?', createdAt: new Date(), updatedAt: new Date() },
      { userId: 4, chatRoomId: 4, content: 'Who’s cooking today?', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete(options, null, {});
  }
};
