'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Place extends Model {
    static associate(models) {
      Place.hasMany(models.Event, { foreignKey: 'placeId' });
    }
  }

  Place.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Place',
    tableName: 'places',
    timestamps: true
  });

  return Place;
};
