"use strict";

const { QueryTypes } = require("sequelize");

let options = { tableName: "Media" };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface) {
    const schema = options.schema || "public";
    const table = options.tableName;
    const dialect = queryInterface.sequelize.getDialect();

    // ✅ Reset Media per dialect
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

    // ✅ Build SELECTs that work on both DBs
    const usersSql =
      dialect === "postgres"
        ? `SELECT id FROM "${schema}"."Users" ORDER BY id;`
        : `SELECT id FROM "Users" ORDER BY id;`;

    const eventsSql =
      dialect === "postgres"
        ? `SELECT id FROM "${schema}"."Events" ORDER BY id;`
        : `SELECT id FROM "Events" ORDER BY id;`;

    // ✅ Grab real user ids (so FK never fails)
    const users = await queryInterface.sequelize.query(usersSql, {
      type: QueryTypes.SELECT,
    });
    if (!users.length) throw new Error("No users found to seed Media.userId");

    // ✅ Grab real event ids (eventId is nullable, but we attach anyway)
    const events = await queryInterface.sequelize.query(eventsSql, {
      type: QueryTypes.SELECT,
    });
    if (!events.length) throw new Error("No events found to seed Media.eventId");

    const userIds = users.map((u) => u.id);
    const eventIds = events.map((e) => e.id);

    const now = new Date();

    await queryInterface.bulkInsert(
      options,
      [
        {
          userId: userIds[0],
          eventId: eventIds[0],
          url: "https://firebasestorage.googleapis.com/v0/b/the-hype-f3b75.firebasestorage.app/o/events%2Fbackyard%20house.jpg?alt=media&token=f82cee5a-bd87-4ffc-825f-19ac02fc2edd",
          storagePath: "web-uploads/seed1.jpg",
          folder: "web-uploads",
          contentType: "image/jpeg",
          sizeBytes: 245123,
          originalName: "seed1.jpg",
          mediaType: "image",
          createdAt: now,
          updatedAt: now,
        },
        {
          userId: userIds[1] ?? userIds[0],
          eventId: eventIds[1] ?? eventIds[0],
          url: "https://firebasestorage.googleapis.com/v0/b/the-hype-f3b75.firebasestorage.app/o/events%2Fhouse%20rent%20kitchen.jpg?alt=media&token=b9e215de-e2a1-4bb7-9162-d3d1009f8132",
          storagePath: "web-uploads/seed2.jpg",
          folder: "web-uploads",
          contentType: "image/jpeg",
          sizeBytes: 312890,
          originalName: "seed2.jpg",
          mediaType: "image",
          createdAt: now,
          updatedAt: now,
        },
        {
          userId: userIds[2] ?? userIds[0],
          eventId: eventIds[2] ?? eventIds[0],
          url: "https://firebasestorage.googleapis.com/v0/b/the-hype-f3b75.firebasestorage.app/o/events%2Flabs%20ret.jpg?alt=media&token=d195ea78-bd7f-41e3-96bd-1c63d8e4cd1e",
          storagePath: "web-uploads/seed3.mp4",
          folder: "web-uploads",
          contentType: "video/mp4",
          sizeBytes: 9450123,
          originalName: "seed3.mp4",
          mediaType: "video",
          createdAt: now,
          updatedAt: now,
        },
        {
          userId: userIds[3] ?? userIds[0],
          eventId: eventIds[3] ?? eventIds[0],
          url: "https://firebasestorage.googleapis.com/v0/b/the-hype-f3b75.firebasestorage.app/o/events%2Fliving%20room.jpg?alt=media&token=7ec2ce89-5424-4599-a231-ac4bbb8493fc",
          storagePath: "web-uploads/seed4.mp4",
          folder: "web-uploads",
          contentType: "video/mp4",
          sizeBytes: 12045012,
          originalName: "seed4.mp4",
          mediaType: "video",
          createdAt: now,
          updatedAt: now,
        },
                {
          userId: userIds[0],
          eventId: eventIds[0],
          url: "https://firebasestorage.googleapis.com/v0/b/the-hype-f3b75.firebasestorage.app/o/events%2FGriled%20Skewers.png?alt=media&token=cde5f930-625f-4db5-b0aa-6e786e5cbcdc",
          storagePath: "web-uploads/seed5.jpg",
          folder: "web-uploads",
          contentType: "image/jpeg",
          sizeBytes: 284221,
          originalName: "seed5.jpg",
          mediaType: "image",
          createdAt: now,
          updatedAt: now,
        },
        {
          userId: userIds[1] ?? userIds[0],
          eventId: eventIds[1] ?? eventIds[0],
          url: "https://firebasestorage.googleapis.com/v0/b/the-hype-f3b75.firebasestorage.app/o/events%2FVolcano%20eruption.png?alt=media&token=ab113ef3-0f25-4e6a-852e-bb8b5bf68a6c",
          storagePath: "web-uploads/seed6.jpg",
          folder: "web-uploads",
          contentType: "image/jpeg",
          sizeBytes: 311004,
          originalName: "seed6.jpg",
          mediaType: "image",
          createdAt: now,
          updatedAt: now,
        },
        {
          userId: userIds[2] ?? userIds[0],
          eventId: eventIds[2] ?? eventIds[0],
          url: "https://firebasestorage.googleapis.com/v0/b/the-hype-f3b75.firebasestorage.app/o/events%2Fpicnic.png?alt=media&token=b97767af-6c5a-4292-8113-197f7733ef39",
          storagePath: "web-uploads/seed7.jpg",
          folder: "web-uploads",
          contentType: "image/jpeg",
          sizeBytes: 356991,
          originalName: "seed7.jpg",
          mediaType: "image",
          createdAt: now,
          updatedAt: now,
        },
        {
          userId: userIds[3] ?? userIds[0],
          eventId: eventIds[3] ?? eventIds[0],
          url: "https://firebasestorage.googleapis.com/v0/b/the-hype-f3b75.firebasestorage.app/o/events%2Froantic%20dinner.png?alt=media&token=3e23ef58-ffe8-42af-9c9d-2ecb8d95ec16",
          storagePath: "web-uploads/seed8.jpg",
          folder: "web-uploads",
          contentType: "image/jpeg",
          sizeBytes: 401220,
          originalName: "seed8.jpg",
          mediaType: "image",
          createdAt: now,
          updatedAt: now,
        },
        {
          userId: userIds[4],
          eventId: eventIds[0],
          url: "https://firebasestorage.googleapis.com/v0/b/the-hype-f3b75.firebasestorage.app/o/events%2Fevent%20seeder1.png?alt=media&token=b7f5976f-756e-4da4-b2fa-194c5a70b52f",
          storagePath: "web-uploads/seed9.jpg",
          folder: "web-uploads",
          contentType: "image/jpeg",
          sizeBytes: 298552,
          originalName: "seed9.jpg",
          mediaType: "image",
          createdAt: now,
          updatedAt: now,
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
