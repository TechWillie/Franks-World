"use strict";

let options = { tableName: "Events" };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface) {
    const schema = options.schema || "public";
    const table = options.tableName;
    const dialect = queryInterface.sequelize.getDialect();

    // ✅ Reset table per dialect
    if (dialect === "postgres") {
      await queryInterface.sequelize.query(
        `TRUNCATE TABLE "${schema}"."${table}" RESTART IDENTITY CASCADE;`
      );
    } else if (dialect === "sqlite") {
      await queryInterface.sequelize.query(`DELETE FROM "${table}";`);
      await queryInterface.sequelize.query(
        `DELETE FROM sqlite_sequence WHERE name='${table}';`
      );
    } else {
      await queryInterface.bulkDelete(options, null, {});
    }

    const now = new Date();

    await queryInterface.bulkInsert(
      options,
      [
        {
          name: "Picnic Day",
          eventDate: new Date("2025-05-15"),
          placeId: 1,
          hostId: 1,
          chatRoomId: 1,
          createdAt: new Date("2025-01-21"),
          updatedAt: now,
          description: "A day out with the kids. A real family affair",
        },
        {
          name: "Photo Walk",
          eventDate: new Date("2025-06-01"),
          placeId: 2,
          hostId: 2,
          chatRoomId: 2,
          createdAt: new Date("2024-09-09"),
          updatedAt: now,
          description: "Pull out the red carpet. Strut your stuff",
        },
        {
          name: "LAN Party",
          eventDate: new Date("2025-06-20"),
          placeId: 3,
          hostId: 3,
          chatRoomId: 3,
          createdAt: new Date("2025-02-12"),
          updatedAt: now,
          description: "Local Area Networking fiesta. Bring drinks and portfolio..!",
        },
        {
          name: "Food Festival",
          eventDate: new Date("2025-07-10"),
          placeId: 4,
          hostId: 4,
          chatRoomId: 4,
          createdAt: new Date("2026-07-14"),
          updatedAt: now,
          description: "For the fattie in us all. Please serve yourself..",
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    const schema = options.schema || "public";
    const table = options.tableName;
    const dialect = queryInterface.sequelize.getDialect();

    if (dialect === "postgres") {
      await queryInterface.sequelize.query(
        `TRUNCATE TABLE "${schema}"."${table}" RESTART IDENTITY CASCADE;`
      );
    } else if (dialect === "sqlite") {
      await queryInterface.sequelize.query(`DELETE FROM "${table}";`);
      await queryInterface.sequelize.query(
        `DELETE FROM sqlite_sequence WHERE name='${table}';`
      );
    } else {
      await queryInterface.bulkDelete(options, null, {});
    }
  },
};
