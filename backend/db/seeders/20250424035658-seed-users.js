"use strict";
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");

let options = { tableName: "Users" };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface) {
    const schema = options.schema || "public";
    const table = options.tableName;

    const dialect = queryInterface.sequelize.getDialect();

    // ✅ Reset table contents + IDs in a DB-specific way
    if (dialect === "postgres") {
      // Postgres supports TRUNCATE + restart identity + cascade
      await queryInterface.sequelize.query(
        `TRUNCATE TABLE "${schema}"."${table}" RESTART IDENTITY CASCADE;`
      );
    } else if (dialect === "sqlite") {
      // SQLite does NOT support TRUNCATE
      await queryInterface.sequelize.query(`DELETE FROM "${table}";`);

      // Reset AUTOINCREMENT counter (only applies if table uses AUTOINCREMENT)
      await queryInterface.sequelize.query(
        `DELETE FROM sqlite_sequence WHERE name='${table}';`
      );
    } else {
      // Fallback: works for most dialects (MySQL, etc.)
      await queryInterface.bulkDelete(options, null, {});
    }

    // ✅ PROOF: show table is empty after reset
    const after = await queryInterface.sequelize.query(
      dialect === "postgres"
        ? `SELECT id FROM "${schema}"."${table}" ORDER BY id;`
        : `SELECT id FROM "${table}" ORDER BY id;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    console.log("Users AFTER RESET:", after);

    // ✅ Insert WITHOUT id fields
    await queryInterface.bulkInsert(
      options,
      [
        {
          firstName: "Demo",
          lastName: "User",
          username: "demo",
          email: "demo@user.io",
          hashedPassword: bcrypt.hashSync("password"),
          bio: null,
          photo: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Test",
          lastName: "User2",
          username: "demo2",
          email: "demo2@user.io",
          hashedPassword: bcrypt.hashSync("password"),
          bio: null,
          photo: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Jane",
          lastName: "Doe",
          username: "janedoe",
          email: "jane@user.io",
          hashedPassword: bcrypt.hashSync("password"),
          bio: "Just exploring Franks World",
          photo: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "John",
          lastName: "Smith",
          username: "johnsmith",
          email: "john@user.io",
          hashedPassword: bcrypt.hashSync("password"),
          bio: "Love events and chats",
          photo: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Willie",
          lastName: "Rainey",
          username: "techwillie",
          email: "techwillie@user.io",
          hashedPassword: bcrypt.hashSync("password"),
          bio: "Creator of Franks World",
          photo: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // ✅ PROOF: show ids after insert
    const final = await queryInterface.sequelize.query(
      dialect === "postgres"
        ? `SELECT id, username FROM "${schema}"."${table}" ORDER BY id;`
        : `SELECT id, username FROM "${table}" ORDER BY id;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    console.log("Users AFTER INSERT:", final);
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

