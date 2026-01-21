"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Media extends Model {
    static associate(models) {
      Media.belongsTo(models.User, { foreignKey: "userId" });
      Media.belongsTo(models.Event, { foreignKey: "eventId" });
    }
  }

  Media.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      // Firebase download URL
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      // Firebase storage object path (so you can delete/replace later)
      storagePath: {
        type: DataTypes.STRING(512),
        allowNull: false,
      },

      folder: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      contentType: {
        type: DataTypes.STRING(128),
        allowNull: true, // image/jpeg, video/mp4, etc
      },

      sizeBytes: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },

      originalName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      // replaces old "type"
      mediaType: {
        type: DataTypes.ENUM("image", "video"),
        allowNull: false,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      eventId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Media",
      tableName: "Media",
      timestamps: true,
    }
  );

  return Media;
};
