
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
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Hobbie',
    tableName: 'hobbies', // Matches your table name in migration
    timestamps: true
  });
  return Hobbie;
};
