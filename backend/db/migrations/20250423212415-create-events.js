"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const t = (name) =>
  process.env.NODE_ENV === "production"
    ? { tableName: name, schema: options.schema }
    : name;

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("EVENTS SCHEMA ENV:", process.env.SCHEMA, "OPTIONS:", options);

    await queryInterface.createTable(
      "Events",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },

        // example columns — keep yours
        name: { type: Sequelize.STRING, allowNull: false },
        description: { type: Sequelize.TEXT, allowNull: true },

        // ✅ if you have a host user
        hostId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: t("Users"), key: "id" },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },

        // ✅ if you link to Places
        placeId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: t("Places"), key: "id" },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },

        // ✅ if you link to ChatRooms
        chatRoomId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: t("ChatRooms"), key: "id" },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },

        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );

    // ✅ If you add indexes/constraints, do it like this:
    // await queryInterface.addIndex(t("Events"), ["hostId"]);
    // await queryInterface.addIndex(t("Events"), ["chatRoomId"]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Events";
    await queryInterface.dropTable(options);
  },
};
