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
    seederStorage: "sequelize",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
