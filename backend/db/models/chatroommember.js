'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ChatRoomMember extends Model {}

  ChatRoomMember.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chatRoomId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ChatRoomMember',
    tableName: 'ChatRoomMembers',
    timestamps: true
  });

  return ChatRoomMember;
};
