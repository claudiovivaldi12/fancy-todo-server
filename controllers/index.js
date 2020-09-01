const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const Telegraf = require('telegraf')
const { User,Todos } = require('../models')
// const bot = new Telegraf('1038156982:AAGcg_B9dAtiZ1YF2T9JTubmTU4yJlXpE4c')
// bot.launch()

class Controller{
  static postRegister(req,res){
     // res.send('ini register user')
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })
    .then(user =>{
      res.status(200).json('Success')
    })
    .catch(err =>{
      console.log(err)
      res.status(500).json(err)
    })
  }
  static async postLogin(req,res){
    try{
      const user = await User.findOne({where: {email: req.body.email}})
      if(!user){
        return res.status(404).json({message: 'Please Register First'})
      }
      else{
        if(bcrypt.compareSync(req.body.password,user.password)){
        /* decoded :{
          const decoded = jwt.verify(access_token,secret_key)
        }
        */
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

  static getTodos(req,res){
    console.log(req.loggedInUser)
    Todos.findAll({
      include:User
    })
    .then(data =>{
      res.json(data)
    })
    .catch(err =>{
      res.status(500).json('Internal Server Error')
    })
  }
  static postTodos(req,res){
    Todos.create({
      title:req.body.title,
      description:req.body.description,
      status:'Not Yet',
      due_date:req.body.due_date,
      UserId: req.body.UserId,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .then(data =>{
      res.status(200).json(data)
    })
    .catch(err =>{
      res.status(500).json(err)
    })
  }
  static getTodosId(req,res){
    Todos.findByPk(req.params.id)
    .then(data =>{
      if(data){
        res.status(200).json(data)
      }
      else{
          res.status(404).json('Not Found')
      }
    })
    .catch(err =>{
      res.status(500).json('Internal Server Error')
    })
  }
  static delTodos(req,res){
    Todos.destroy({
      where:{
        id:req.params.id
      }
    })
    .then(data =>{
      res.status(200).json('delete success')
    })
    .catch(err =>{
      res.status(500).json('internal server error')
    })
  }
  static putTodos(req,res){
    Todos.findeOne({
      where:{
        id:req.params.id
      }
    })
    .then(data =>{
      if(data){
        return Todos.update({
          title:req.body.title,
          description:req.body.description,
          status:req.body.status,
          // due_date:req.body.due_date,
          updatedAt: new Date()
        },{
          where:{
            id:req.params.id
          }
        })
        .then(data =>{
          res.status(200).json('update success')
        })
      }
      else{
        res.status(404).json('data not found')
      }
    })
    .catch(err =>{
      res.status(500).json(err)
    })
  }
}
module.exports = Controller
