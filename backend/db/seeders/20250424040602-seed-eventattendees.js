"use strict";

let options = { tableName: "EventAttendees" };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface) {
    const schema = options.schema || "public";

    // ✅ Reset table safely every deploy
    await queryInterface.sequelize.query(
      `TRUNCATE TABLE "${schema}"."EventAttendees" RESTART IDENTITY CASCADE;`
    );

    await queryInterface.bulkInsert(
      options,
      [
        { userId: 1, eventId: 1, createdAt: new Date(), updatedAt: new Date() },
        { userId: 2, eventId: 2, createdAt: new Date(), updatedAt: new Date() },
        { userId: 3, eventId: 3, createdAt: new Date(), updatedAt: new Date() },
        { userId: 4, eventId: 4, createdAt: new Date(), updatedAt: new Date() },
      ],
      {}
    );
  },

  async down(queryInterface) {
    const schema = options.schema || "public";
    await queryInterface.sequelize.query(
      `TRUNCATE TABLE "${schema}"."EventAttendees" RESTART IDENTITY CASCADE;`
    );
  },
};
