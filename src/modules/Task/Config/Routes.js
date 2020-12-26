import express from 'express'
const router = express.Router()

import RouteBuilder from'../../../utils/route/RouteBuilder'
import TaskController from'../Controller/TaskController'
import authMiddleware from'../../../middlewares/auth'

new RouteBuilder(router, '/tasks', TaskController, authMiddleware)
    .get()
    .getOne()
    .post()
    .patch()
    .del()

export default router

