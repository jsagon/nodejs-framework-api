const router = require('express').Router()
const RouteBuilder = require('../../../utils/route/RouteBuilder')
const TaskController = require('../Controller/TaskController')
const authMiddleware = require('../../../middlewares/auth')

new RouteBuilder(router, '/tasks', TaskController, authMiddleware)
    .get()
    .getOne()
    .post()
    .patch()
    .del()

module.exports = router

