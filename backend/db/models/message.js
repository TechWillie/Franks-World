'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, { foreignKey: 'userId' });
      Message.belongsTo(models.ChatRoom, { foreignKey: 'chatRoomId' });
    }
  }

  Message.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
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
    modelName: 'Message',
    tableName: 'Messages',
    timestamps: true
  });

  return Message;
};
