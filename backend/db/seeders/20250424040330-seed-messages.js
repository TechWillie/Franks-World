"use strict";

let options = { tableName: "Messages" };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface) {
    const schema = options.schema || "public";
    const table = options.tableName;
    const dialect = queryInterface.sequelize.getDialect();

    // ✅ Reset table per dialect
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

    const now = new Date();

    await queryInterface.bulkInsert(
      options,
      [
        {
          userId: 1,
          chatRoomId: 1,
          content: "Hey everyone!",
          createdAt: now,
          updatedAt: now,
        },
        {
          userId: 2,
          chatRoomId: 2,
          content: "Ready to plan our trip?",
          createdAt: now,
          updatedAt: now,
        },
        {
          userId: 3,
          chatRoomId: 3,
          content: "What game are we playing tonight?",
          createdAt: now,
          updatedAt: now,
        },
        {
          userId: 4,
          chatRoomId: 4,
          content: "Who’s cooking today?",
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
