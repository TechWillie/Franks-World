'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Event extends Model {
    static associate(models) {
      Event.belongsTo(models.Place, { foreignKey: 'placeId' });
      Event.belongsTo(models.ChatRoom, { foreignKey: 'chatRoomId' });
      Event.belongsToMany(models.User, {
        through: 'EventAttendees',
        foreignKey: 'eventId',
        otherKey: 'userId'
      });
    }
  }

  Event.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    placeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chatRoomId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'Events',
    timestamps: true
  });

  return Event;
};
