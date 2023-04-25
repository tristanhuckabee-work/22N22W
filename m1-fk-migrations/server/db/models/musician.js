'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Musician extends Model {
    static associate(models) {
      // Your code here
      Musician.belongsTo( models.Band );
      Musician.belongsToMany( models.Instrument, {
        foreignKey: 'musicianId',
        otherKey: 'instrumentId',
        through: models.MusicianInstrument
      });
    }
  };
  Musician.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    bandId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Bands',
        key: 'id'
      },
      onDelete: 'cascade'
    }
  }, {
    sequelize,
    modelName: 'Musician',
  });
  return Musician;
};