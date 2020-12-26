import UserController from '../Controller/UserController'
import RouterBuilder from '../../../utils/route/RouteBuilder'
import authMiddleware from '../../../middlewares/auth'
import express from 'express'

const router = express.Router()

new RouterBuilder(router, '/users', UserController)
    //sem middleware de autenticação
    .post()
    .post({uri:'/login', action:'login'})
    //com middleware de autenticação
    .setBaseMiddlewares([authMiddleware])
    .get({uri:'/me', action:'get'})
    .post({uri:'/logout', action:'logout'})
    .post({uri:'/logoutAll', action:'logoutAll'})
    .del({uri:'/me', action:'delete'})
    .patch({uri:'/me', action:'update'})

export default router