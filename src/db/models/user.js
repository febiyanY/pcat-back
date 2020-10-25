'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Day, {
        foreignKey: 'user_id',
        as: 'schedule',
        through: models.Schedule
      })

      User.hasMany(models.Attendance, {
        foreignKey: 'user_id'
      })
    }
  };
  User.init({
    username: DataTypes.STRING,
    name: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      defaultValue: 'password'
    },
    type: {
      type : DataTypes.STRING,
      defaultValue: 'client'
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(async(user) => {
    user.password = await bcrypt.hash(user.password, 10)
    return
  })

  return User;
};