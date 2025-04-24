'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Media extends Model {
    static associate(models) {
      Media.belongsTo(models.User, { foreignKey: 'userId' });
      Media.belongsTo(models.Event, { foreignKey: 'eventId' });
    }
  }

  Media.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('image', 'video'),
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Media',
    tableName: 'Media',
    timestamps: true
  });

  return Media;
};
