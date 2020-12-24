const UserController = require('../Controller/UserController')
const RouterBuilder = require('../../../utils/route/RouteBuilder')
const authMiddleware = require('../../../middlewares/auth')

const router = require('express').Router()

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

module.exports = router