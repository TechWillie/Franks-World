"use strict";

let options = { tableName: "ChatRooms" };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface) {
    const schema = options.schema || "public";

    // ✅ Reset table to avoid UNIQUE(name) conflicts
    await queryInterface.sequelize.query(
      `TRUNCATE TABLE "${schema}"."ChatRooms" RESTART IDENTITY CASCADE;`
    );

    await queryInterface.bulkInsert(
      options,
      [
        { name: "General", createdAt: new Date(), updatedAt: new Date() },
        { name: "Travel Buddies", createdAt: new Date(), updatedAt: new Date() },
        { name: "Gamers Unite", createdAt: new Date(), updatedAt: new Date() },
        { name: "Foodies Chat", createdAt: new Date(), updatedAt: new Date() },
      ],
      {}
    );
  },

  async down(queryInterface) {
    const schema = options.schema || "public";
    await queryInterface.sequelize.query(
      `TRUNCATE TABLE "${schema}"."ChatRooms" RESTART IDENTITY CASCADE;`
    );
  },
};

