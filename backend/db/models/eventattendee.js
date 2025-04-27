'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class EventAttendee extends Model {}

  EventAttendee.init({
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
