
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hobbie extends Model {
    static associate(models) {
      Hobbie.belongsToMany(models.User, {
        through: 'UserHobbies',
        foreignKey: 'hobbyId',
        otherKey: 'userId'
      });
    }
  }
  Hobbie.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Hobbie',
    tableName: 'Hobbies', // Matches your table name in migration
    timestamps: true
  });
  return Hobbie;
};
