'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ChatRoomMember extends Model {}

  ChatRoomMember.init({
    user_Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chat_Room_Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ChatRoomMember',
    tableName: 'Chat_Room_Members',
    timestamps: true
  });

  return ChatRoomMember;
};
