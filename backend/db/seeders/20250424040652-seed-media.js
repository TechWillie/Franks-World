"use strict";

const { QueryTypes } = require("sequelize");

let options = { tableName: "Media" };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface) {
    const schema = options.schema || "public";

    // ✅ Reset Media every deploy (prevents duplicates / unique / FK weirdness)
    await queryInterface.sequelize.query(
      `TRUNCATE TABLE "${schema}"."Media" RESTART IDENTITY CASCADE;`
    );

    // ✅ Grab real user ids (so FK never fails)
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "${schema}"."Users" ORDER BY id`,
      { type: QueryTypes.SELECT }
    );
    if (!users.length) throw new Error("No users found to seed Media.userId");

    // ✅ Grab real event ids (eventId is nullable in your schema, but we can still attach)
    const events = await queryInterface.sequelize.query(
      `SELECT id FROM "${schema}"."Events" ORDER BY id`,
      { type: QueryTypes.SELECT }
    );
    if (!events.length) throw new Error("No events found to seed Media.eventId");

    const userIds = users.map((u) => u.id);
    const eventIds = events.map((e) => e.id);

    await queryInterface.bulkInsert(
      options,
      [
        {
          userId: userIds[0],
          eventId: eventIds[0],
          url: "https://picsum.photos/200/300",
          storagePath: "web-uploads/seed1.jpg",
          folder: "web-uploads",
          contentType: "image/jpeg",
          sizeBytes: 245123,
          originalName: "seed1.jpg",
          mediaType: "image",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: userIds[1] ?? userIds[0],
          eventId: eventIds[1] ?? eventIds[0],
          url: "https://picsum.photos/200/300",
          storagePath: "web-uploads/seed2.jpg",
          folder: "web-uploads",
          contentType: "image/jpeg",
          sizeBytes: 312890,
          originalName: "seed2.jpg",
          mediaType: "image",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: userIds[2] ?? userIds[0],
          eventId: eventIds[2] ?? eventIds[0],
          url: "https://picsum.photos/200/300",
          storagePath: "web-uploads/seed3.mp4",
          folder: "web-uploads",
          contentType: "video/mp4",
          sizeBytes: 9450123,
          originalName: "seed3.mp4",
          mediaType: "video",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: userIds[3] ?? userIds[0],
          eventId: eventIds[3] ?? eventIds[0],
          url: "https://picsum.photos/200/300",
          storagePath: "web-uploads/seed4.mp4",
          folder: "web-uploads",
          contentType: "video/mp4",
          sizeBytes: 12045012,
          originalName: "seed4.mp4",
          mediaType: "video",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    const schema = options.schema || "public";
    await queryInterface.sequelize.query(
      `TRUNCATE TABLE "${schema}"."Media" RESTART IDENTITY CASCADE;`
    );
  },
};
