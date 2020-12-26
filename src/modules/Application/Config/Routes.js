import express from 'express'
const router = express.Router()

import RouteBuilder from'../../../utils/route/RouteBuilder'
import ApplicationController from'../Controller/ApplicationController'

new RouteBuilder(router, '/', ApplicationController)
    .get({action:'get'})

export default router

