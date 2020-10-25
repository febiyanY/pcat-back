'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Day extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Day.belongsToMany(models.User, {
        foreignKey: 'day_id',
        as: 'schedule',
        through: models.Schedule
      })

      Day.hasMany(models.Attendance, {
        foreignKey: 'day_id'
      })
    }
  };
  Day.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Day',
  });
  return Day;
};