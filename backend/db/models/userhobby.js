'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UserHobby extends Model {
    static associate(models) {
      // No direct associations usually needed here
    }
  }

  UserHobby.init({
    user_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE'
    },
    hobby_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Hobbies', key: 'id' },
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'UserHobby',
    tableName: 'UserHobbies',
    timestamps: true
  });

  return UserHobby;
};
