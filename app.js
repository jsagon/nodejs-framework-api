import './src/bootstrap/InitFeatures'
import RoutesRegister from './src/bootstrap/RoutesRegister'
import Handles from './src/bootstrap/Handles'
import express from 'express'

class App {

    constructor(app) {
        this._app = app 
        
        // Inicializações e configurações
        this._configure()
        this._registerRoutes()
        this._registerHandles()
    }

    /**
     * Inicializa o servidor
     */
    start() {
        this._app.listen(process.env.PORT, () => {
            console.log('Server online')
        })
    }

    /**
     * Configurações base do express
     */
    _configure() {
        this._app.use(express.json())
    }

    /**
     * Inicializa a configuração das rotas da aplicação
     */
    _registerRoutes() {
        const routesRegister = new RoutesRegister(this._app)
        routesRegister.load()
    }

    /**
     * Registra middlewares padrões da aplicação
     */
    _registerHandles() {
        new Handles(this._app).all()
    }
    
    /**
     * Retorna instancia express
     */
    getApp() {
        return this._app
    }
}

const app = express()
const appInstance = new App(app)

export default appInstance