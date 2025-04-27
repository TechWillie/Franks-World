'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class EventAttendee extends Model {}

  EventAttendee.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'EventAttendee',
    tableName: 'EventAttendees',
    timestamps: true
  });

  return EventAttendee;
};
