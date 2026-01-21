'use strict';

let options = { tableName: "ChatRooms" };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(options, [
      { id: 1, name: 'General', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Travel Buddies', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Gamers Unite', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'Foodies Chat', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete(options, null, {});
  }
};
