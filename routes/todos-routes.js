const express = require('express')
const router = express.Router()

const Controller = require('../controllers')
const authentication = require('../middlewares/authentication.js')

router.get('/', authentication, Controller.getTodos)
router.post('/',Controller.postTodos)
router.get('/:id',Controller.getTodosId)
router.put('/:id',Controller.putTodos)
router.delete('/:id',Controller.delTodos)

module.exports = router
