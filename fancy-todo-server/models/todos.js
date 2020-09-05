'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Todos.belongsTo(models.User)
    }
  };
  Todos.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.STRING,
    due_date: {
      type: DataTypes.DATE,
      validate:{
        //[0-9]{4}-[0-9]{2}-[0-9]{2}
        isValidDate(due_date){
          let date = new Date()
          let thisDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate() - 1}`
          let now = new Date(thisDate)
          //if(new Date(due_date) < new Date(Date.now())){
          // let date = new RegExp(`[0-9]{4}-[0-9]{2}-[0-9]{2}`)
          if(new Date(due_date) < new Date(Date.now()).setHours(0, 0, 0, 0)){
            throw new Error('Invalid Date');
          }
        }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Todos',
  });
  return Todos;
};
