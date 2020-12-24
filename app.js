require('./src/bootstrap/init_features')

const RoutesRegister = require('./src/bootstrap/routes')
const Handles = require('./src/bootstrap/handles')

const express = require('express') 
const app = express()

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
     * 
     */
    _registerHandles() {
        new Handles(this._app).all()
    }
    
}

const appInstance = new App(app)
appInstance.start()