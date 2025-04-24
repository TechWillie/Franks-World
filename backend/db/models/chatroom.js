'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ChatRoom extends Model {
    static associate(models) {
      ChatRoom.belongsToMany(models.User, {
        through: 'Chat_Room_Members',
        foreignKey: 'chatRoomId',
        otherKey: 'userId'
      });

      ChatRoom.hasMany(models.Message, { foreignKey: 'chatRoomId' });
      ChatRoom.hasOne(models.Event, { foreignKey: 'chatRoomId' });
    }
  }

  ChatRoom.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ChatRoom',
    tableName: 'Chat_Rooms',
    timestamps: true
  });

  return ChatRoom;
};
