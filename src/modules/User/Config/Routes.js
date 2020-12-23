const UserController = require('../Controller/UserController')
const RouterBuilder = require('../../../utils/RouteBuilder')
const authMiddleware = require('../../../middlewares/auth')

const router = require('express').Router()

new RouterBuilder(router, '/users', UserController/*, authMiddleware*/)
    //sem middleware de autenticação
    .post()
    .post({uri:'/login', action:'login'})
    //com middleware de autenticação
    .get({middlewares:[authMiddleware], uri:'/me', action:'get'})
    .post({uri:'/logout', action:'logout'})
    .post({uri:'/logoutAll', action:'logoutAll'})
    

module.exports = router