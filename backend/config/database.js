// backend/config/database.js
require("dotenv").config();

module.exports = {
  development: {
    dialect: "sqlite",
    storage: process.env.DB_FILE || "db/dev.db",
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true,
  },

  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",

    // ✅ Make BOTH migrations + seed metadata tables live in your schema
    migrationStorage: "sequelize",
    seederStorage: "sequelize",
    migrationStorageTableSchema: process.env.SCHEMA,
    seederStorageTableSchema: process.env.SCHEMA,

    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },

      // ✅ Force runtime queries to use your schema first (instead of public)
      // (including User.create, Media.create, etc.)
      options: `-c search_path=${process.env.SCHEMA}`,
    },
  },
};


