'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class speaker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  speaker.init({
    name: DataTypes.STRING,
    speakerPhoto: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'speaker',
  });
  return speaker;
};