"use strict";

let options = { tableName: "ChatRoomMembers" };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface) {
    const schema = options.schema || "public";

    // ✅ Reset join table every deploy (prevents FK + duplicate issues)
    await queryInterface.sequelize.query(
      `TRUNCATE TABLE "${schema}"."ChatRoomMembers" RESTART IDENTITY CASCADE;`
    );

    await queryInterface.bulkInsert(
      options,
      [
        { userId: 1, chatRoomId: 1, createdAt: new Date() },
        { userId: 2, chatRoomId: 2, createdAt: new Date() },
        { userId: 3, chatRoomId: 3, createdAt: new Date() },
        { userId: 4, chatRoomId: 4, createdAt: new Date() },
        { userId: 5, chatRoomId: 1, createdAt: new Date() }, // optional
      ],
      {}
    );
  },

  async down(queryInterface) {
    const schema = options.schema || "public";
    await queryInterface.sequelize.query(
      `TRUNCATE TABLE "${schema}"."ChatRoomMembers" RESTART IDENTITY CASCADE;`
    );
  },
};
