"use strict";

let options = { tableName: "Events" };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface) {
    const schema = options.schema || "public";

    // ✅ Reset Events every deploy (and dependent rows if any)
    await queryInterface.sequelize.query(
      `TRUNCATE TABLE "${schema}"."Events" RESTART IDENTITY CASCADE;`
    );

    await queryInterface.bulkInsert(
      options,
      [
        {
          name: "Picnic Day",
          eventDate: new Date("2025-05-15"),
          placeId: 1,
          hostId: 1,
          chatRoomId: 1,
          createdAt: new Date("2025-01-21"), // ✅ fixed invalid date string
          updatedAt: new Date(),
        },
        {
          name: "Photo Walk",
          eventDate: new Date("2025-06-01"),
          placeId: 2,
          hostId: 2,
          chatRoomId: 2,
          createdAt: new Date("2024-09-09"),
          updatedAt: new Date(),
        },
        {
          name: "LAN Party",
          eventDate: new Date("2025-06-20"),
          placeId: 3,
          hostId: 3,
          chatRoomId: 3,
          createdAt: new Date("2025-02-12"),
          updatedAt: new Date(),
        },
        {
          name: "Food Festival",
          eventDate: new Date("2025-07-10"),
          placeId: 4,
          hostId: 4,
          chatRoomId: 4,
          createdAt: new Date("2026-07-14"),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    const schema = options.schema || "public";
    await queryInterface.sequelize.query(
      `TRUNCATE TABLE "${schema}"."Events" RESTART IDENTITY CASCADE;`
    );
  },
};
