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
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hostId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    eventDate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    placeId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    chatRoomId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'Events',
    timestamps: true
  });

  return Event;
};
