const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const Telegraf = require('telegraf')
const { User,Todos } = require('../models')
// const bot = new Telegraf('1038156982:AAGcg_B9dAtiZ1YF2T9JTubmTU4yJlXpE4c')
// bot.launch()

class Controller{
  static postRegister(req,res,next){
     // res.send('ini register user')
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })
    .then(user =>{
      res.status(200).json('Success')
    })
    .catch(next)
  }
  static async postLogin(req,res){
    try{
      const user = await User.findOne({where: {email: req.body.email}})
      if(!user){
        return res.status(404).json({message: 'Please Register First'})
      }
      else{
        if(bcrypt.compareSync(req.body.password,user.password)){
          const access_token = jwt.sign({id: user.id,email:user.email},process.env.SECRET_KEY)
          return res.status(200).json({access_token})
        }
        else{
          return res.status(401).json({message: 'Incorrect email/password'})
        }
      }
    }
    catch(err) {
      console.log(err)
      return res.status(500).json({message: err.message})
    }
  }

  static getTodos(req,res,next){
    // console.log(req.loggedInUser)
    User.findOne({
      where:{
        id:req.loggedInUser.id
      }
    })
    .then(user =>{
        Todos.findAll({
        where:{
          UserId:user.id
        },
        include:User
      })
      .then(data =>{
        if(data){
          res.json(data)
        }
        else{
          throw { message : `Sorry There is no id ${req.params.id} in database` , status:404}
        }
      })
    })
    .catch(next)
  }
  static postTodos(req,res,next){
    console.log(req.body);
    console.log(req.loggedInUser)
    Todos.create({
      title:req.body.title,
      description:req.body.description,
      status:'Not Yet',
      due_date:req.body.due_date,
      UserId: req.loggedInUser.id,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .then(data =>{
      res.status(200).json(data)
    })
    .catch(next)
  }
  static getTodosId(req,res,next){
    Todos.findByPk(req.params.id)
    .then(data =>{
      if(data){
        res.status(200).json(data)
      }
      else{
          throw { message : `Sorry There is no id ${req.params.id} in database` , status:404}
      }
    })
    .catch(next)
  }
  static delTodos(req,res,next){
    Todos.destroy({
      where:{
        id:req.params.id
      }
    })
    .then(data =>{
      res.status(200).json('delete success')
    })
    .catch(next)
  }
  static putTodos(req,res,next){
    console.log('ini body',req.body)
    Todos.update({
      title:req.body.title,
      description:req.body.description,
      status:req.body.status
    },{
      where:{
        id:req.params.id
      }
    })
    .then(data =>{
      res.status(200).json('update success')
    })
    .catch(next)
  }
}
module.exports = Controller
