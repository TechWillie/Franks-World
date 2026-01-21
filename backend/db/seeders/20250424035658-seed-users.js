"use strict";
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");

let options = { tableName: "Users" };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface) {
    // ✅ Figure out EXACT fully qualified table name
    const schema = options.schema || "public";
    const table = options.tableName;

    console.log("SEED-USERS schema/table:", schema, table);

    // ✅ Hard reset the exact table we will insert into
    // CASCADE clears dependent rows; RESTART IDENTITY resets ids
    await queryInterface.sequelize.query(
      `TRUNCATE TABLE "${schema}"."${table}" RESTART IDENTITY CASCADE;`
    );

    // ✅ PROOF: show what's in the table after truncation (should be empty)
    const after = await queryInterface.sequelize.query(
      `SELECT id FROM "${schema}"."${table}" ORDER BY id;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    console.log("Users AFTER TRUNCATE:", after); // must be []

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
        }
      ],
      {}
    );

    // ✅ PROOF: show ids after insert
    const final = await queryInterface.sequelize.query(
      `SELECT id, username FROM "${schema}"."${table}" ORDER BY id;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    console.log("Users AFTER INSERT:", final);
  },

  async down(queryInterface) {
    const schema = options.schema || "public";
    const table = options.tableName;
    await queryInterface.sequelize.query(
      `TRUNCATE TABLE "${schema}"."${table}" RESTART IDENTITY CASCADE;`
    );
  },
};

