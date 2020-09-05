const jwt = require('jsonwebtoken')

function authentication(req,res,next){
  if(!req.headers.token){
    console.log('header1')
    console.log(req.headers.token)
    res.status(401).json({
      message:'Auth Fail'
    })
  }
  else{
    try{
      const payload = jwt.verify(req.headers.token,process.env.SECRET_KEY)
      req.loggedInUser = payload;
        next();
    }catch(err){
      console.log('header3')
      console.log(err)
      res.status(401).json({
        message:'Unauthorize Request'
      })
    }
  }
}
module.exports = authentication
