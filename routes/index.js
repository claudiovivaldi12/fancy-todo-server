const express = require('express')
const router = express.Router()

const todosRoutes = require('./todos-routes.js')
const userRoutes = require('./user-routes.js')
// routes.use('/todos',todosRoutes)
router.use('/todos',todosRoutes)
router.use('/user',userRoutes)

module.exports = router
