"use strict";

let options = { tableName: "UserHobbies" };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface) {
    const schema = options.schema || "public";
    const table = options.tableName;
    const dialect = queryInterface.sequelize.getDialect();

    // ✅ Reset table (Postgres vs SQLite)
    if (dialect === "postgres") {
      await queryInterface.sequelize.query(
        `TRUNCATE TABLE "${schema}"."${table}" RESTART IDENTITY CASCADE;`
      );
    } else if (dialect === "sqlite") {
      await queryInterface.sequelize.query(`DELETE FROM "${table}";`);
      // reset autoincrement counter (harmless even if not used)
      await queryInterface.sequelize.query(
        `DELETE FROM sqlite_sequence WHERE name='${table}';`
      );
    } else {
      await queryInterface.bulkDelete(options, null, {});
    }

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
