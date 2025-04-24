'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class EventAttendee extends Model {}

  EventAttendee.init({
    event_Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'EventAttendee',
    tableName: 'Event_Attendees',
    timestamps: true
  });

  return EventAttendee;
};
