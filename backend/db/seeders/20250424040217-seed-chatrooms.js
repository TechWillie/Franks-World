'use strict';

let options = { tableName: "ChatRooms" };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(options, [
      { name: 'General', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Travel Buddies', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Gamers Unite', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Foodies Chat', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete(options, null, {});
  }
};
