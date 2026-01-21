'use strict';

let options = { tableName: 'Events' };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}


module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(options, [
      { id: 1, name: 'Picnic Day', eventDate: '2025-05-15', placeId: 1, hostId: 1, chatRoomId: 1, createdAt: new Date("2025-01-021"), updatedAt: new Date() },
      { id: 2, name: 'Photo Walk', eventDate: '2025-06-01', placeId: 2, hostId: 2, chatRoomId: 2, createdAt: new Date("2024-09-09"), updatedAt: new Date() },
      { id: 3, name: 'LAN Party', eventDate: '2025-06-20', placeId: 3, hostId: 3, chatRoomId: 3, createdAt: new Date("2025-02-12"), updatedAt: new Date() },
      { id: 4, name: 'Food Festival', eventDate: '2025-07-10', placeId: 4, hostId: 4, chatRoomId: 4, createdAt: new Date("2026-07-14"), updatedAt: new Date() }
    ]);
     if (queryInterface.sequelize.getDialect() === "postgres") {
        await queryInterface.sequelize.query(
          `SELECT setval('"Events_id_seq"', (SELECT MAX(id) FROM "Events"));`
        );
}

  },
  async down(queryInterface) {
    await queryInterface.bulkDelete(options, null, {});
  }
};
