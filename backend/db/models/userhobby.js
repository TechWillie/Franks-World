'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UserHobbie extends Model {
    static associate(models) {
      // No direct associations usually needed here
    }
  }

  UserHobbie.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE'
    },
    hobbyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Hobbie', key: 'id' },
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'UserHobbie',
    tableName: 'UserHobbies',
    timestamps: true
  });

  return UserHobby;
};
