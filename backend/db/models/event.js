'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Event extends Model {
    static associate(models) {
      Event.belongsTo(models.Place, { foreignKey: 'id' });
      Event.belongsTo(models.ChatRoom, { foreignKey: 'id' });
      
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    eventDate: {
      type: DataTypes.DATEONLY,
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
