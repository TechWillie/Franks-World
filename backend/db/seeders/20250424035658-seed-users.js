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
          photo: "https://firebasestorage.googleapis.com/v0/b/the-hype-f3b75.firebasestorage.app/o/Seed-images%2Fme%20at%20computer.jpg?alt=media&token=c39643aa-f778-4192-8159-1af2d81f5b8b",
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
          photo: "https://firebasestorage.googleapis.com/v0/b/the-hype-f3b75.firebasestorage.app/o/Seed-images%2Fistockphoto-543828714-2048x2048.jpg?alt=media&token=4a4c6a69-3e71-4de4-b38f-2b9a0c161920",
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
          photo: "https://firebasestorage.googleapis.com/v0/b/the-hype-f3b75.firebasestorage.app/o/Seed-images%2Fbrown%20horse.jpg?alt=media&token=e6763bb4-8bf9-4383-b343-12c9126841e9",
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
          photo: "https://firebasestorage.googleapis.com/v0/b/the-hype-f3b75.firebasestorage.app/o/Seed-images%2Fme%20sittiing%20down.jpg?alt=media&token=a4ca12db-75d5-4e57-943f-41315d59ef74",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Willie",
          lastName: "Rainey",
          username: "techwillie",
          email: "techwillie@user.io",
          hashedPassword: bcrypt.hashSync("Theboss"),
          bio: "Creator of Franks World",
          photo: "https://firebasestorage.googleapis.com/v0/b/the-hype-f3b75.firebasestorage.app/o/Seed-images%2FTech%20Willie%20Face%20Crop.png?alt=media&token=795d84b6-eb3a-49c9-8df4-a6dbae6f81e7",
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

