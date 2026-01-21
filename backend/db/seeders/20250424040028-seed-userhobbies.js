"use strict";

let options = { tableName: "UserHobbies" };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface) {
    const schema = options.schema || "public";

    // ✅ Reset join table every deploy (safe + predictable)
    await queryInterface.sequelize.query(
      `TRUNCATE TABLE "${schema}"."UserHobbies" RESTART IDENTITY CASCADE;`
    );

    await queryInterface.bulkInsert(
      options,
      [
        { userId: 1, hobbyId: 1, createdAt: new Date(), updatedAt: new Date() },
        { userId: 2, hobbyId: 2, createdAt: new Date(), updatedAt: new Date() },
        { userId: 3, hobbyId: 3, createdAt: new Date(), updatedAt: new Date() },
        { userId: 4, hobbyId: 4, createdAt: new Date(), updatedAt: new Date() },
        { userId: 5, hobbyId: 1, createdAt: new Date(), updatedAt: new Date() }, // optional extra
      ],
      {}
    );
  },

  async down(queryInterface) {
    const schema = options.schema || "public";
    await queryInterface.sequelize.query(
      `TRUNCATE TABLE "${schema}"."UserHobbies" RESTART IDENTITY CASCADE;`
    );
  },
};
