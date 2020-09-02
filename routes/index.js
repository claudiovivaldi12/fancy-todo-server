const express = require('express')
const router = express.Router()
const errorHandler = require('../middlewares/error-handling.js')
const todosRoutes = require('./todos-routes.js')
const userRoutes = require('./user-routes.js')
// routes.use('/todos',todosRoutes)
router.use('/todos',todosRoutes)
router.use('/user',userRoutes)
router.use(errorHandler)

module.exports = router
