"use strict";

let options = { tableName: "Places" };
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
          name: "Central Park",
          location: "NYC",
          description: "A large public park in the heart of Manhattan.",
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Golden Gate Park",
          location: "San Francisco",
          description: "A large urban park in San Francisco.",
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Millennium Park",
          location: "Chicago",
          description: "A large public park in the heart of Chicago.",
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Balboa Park",
          location: "San Diego",
          description: "A large urban park in San Diego.",
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
