"use strict";

let options = { tableName: "Places" };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface) {
    const schema = options.schema || "public";

    // ✅ Reset table every deploy (prevents UNIQUE + FK issues)
    await queryInterface.sequelize.query(
      `TRUNCATE TABLE "${schema}"."Places" RESTART IDENTITY CASCADE;`
    );

    await queryInterface.bulkInsert(
      options,
      [
        {
          name: "Central Park",
          location: "NYC",
          description: "A large public park in the heart of Manhattan.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Golden Gate Park",
          location: "San Francisco",
          description: "A large urban park in San Francisco.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Millennium Park",
          location: "Chicago",
          description: "A large public park in the heart of Chicago.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Balboa Park",
          location: "San Diego",
          description: "A large urban park in San Diego.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    const schema = options.schema || "public";
    await queryInterface.sequelize.query(
      `TRUNCATE TABLE "${schema}"."Places" RESTART IDENTITY CASCADE;`
    );
  },
};

