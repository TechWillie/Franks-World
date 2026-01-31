"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Media",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },

        // Firebase download URL (can be long)
        url: {
          type: Sequelize.TEXT,
          allowNull: false,
        },

        // Firebase storage path you uploaded to (so you can delete/replace later)
        storagePath: {
          type: Sequelize.STRING(512),
          allowNull: false,
        },

        // Optional helpers / metadata
        folder: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },

        contentType: {
          type: Sequelize.STRING(128),
          allowNull: true, // e.g. image/jpeg, video/mp4
        },

        sizeBytes: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },

        originalName: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },

        // "image" | "video" (keep your original concept)
        mediaType: {
          type: Sequelize.ENUM("image", "video"),
          allowNull: false,
        },

        // Relationships
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
          model: { tableName: "Users", schema: options.schema },
          key: "id",
        },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },

       eventId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model:
            process.env.NODE_ENV === "production"
              ? { tableName: "Events", schema: options.schema }
              : "Events",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
  },

  async down(queryInterface, Sequelize) {
  options.tableName = "Media";
  await queryInterface.dropTable(options);

  // ✅ Only Postgres needs ENUM type cleanup
    if (queryInterface.sequelize.getDialect() === "postgres") {
      if (process.env.NODE_ENV === "production") {
        await queryInterface.sequelize.query(
          `DROP TYPE IF EXISTS "${options.schema}"."enum_Media_mediaType";`
        );
      } else {
        await queryInterface.sequelize.query(
          'DROP TYPE IF EXISTS "enum_Media_mediaType";'
        );
      }
    }
  }
};
