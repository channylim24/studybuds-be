'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  event.init({
    title: DataTypes.STRING,
    eventPhoto: DataTypes.STRING,
    detail: DataTypes.STRING,
    dateStart: DataTypes.STRING,
    dateEnd: DataTypes.STRING,
    organizer: DataTypes.STRING,
    link: DataTypes.STRING,
    id_user: DataTypes.INTEGER,
    id_category: DataTypes.INTEGER,
    id_speaker: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'event',
  });
  return event;
};