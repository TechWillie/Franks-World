'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ChatRoom extends Model {
    static associate(models) {
      ChatRoom.belongsToMany(models.User, {
        through: 'ChatRoomMembers',
        foreignKey: 'chatRoomId',
        otherKey: 'userId'
      });

      ChatRoom.hasMany(models.Message, { foreignKey: 'chatRoomId' });
      ChatRoom.hasOne(models.Event, { foreignKey: 'chatRoomId' });
    }
  }

  ChatRoom.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'ChatRoom',
    tableName: 'ChatRooms',
    timestamps: true
  });

  return ChatRoom;
};
