const express = require('express')
const router = express.Router()

const Controller = require('../controllers')

router.post('/register',Controller.postRegister)
router.post('/login',Controller.postLogin)


module.exports = router
