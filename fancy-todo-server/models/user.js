'use strict';
const bcrypt = require('bcryptjs')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Todos)
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
      // validate:{
      //   is: {
      //     args: /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
      //     msg: "Email Invalid"
      //   }
      // }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: false
      }
    },
    name:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
      notNull: {
         args: true,
         msg: "Name Cannot be empty"
       }
     }

    }
  }, {
    hooks:{
      beforeCreate: (user,options) =>{
        try {
          const salt = bcrypt.genSaltSync(10)
          console.log(salt)
          user.password = bcrypt.hashSync(user.password,salt)
        } catch (err) {
          console.log(err)
        }
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};
