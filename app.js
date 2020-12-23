require('./src/bootstrap/init_features')

const RoutesRegister = require('./src/bootstrap/routes')

const express = require('express') 
const app = express()

class App {

    constructor(app) {
        this._app = app 
        
        // Inicializações e configurações
        this._configure()
        this._registerRoutes()
    }

    _configure() {
        this._app.use(express.json())
    }

    /**
     * Inicializa a configuração das rotas da aplicação
     */
    _registerRoutes () {
        const routesRegister = new RoutesRegister(this._app)
        routesRegister.load()
    }

    /**
     * Inicializa o servidor
     */
    start() {
        this._app.listen(process.env.PORT, () => {
            console.log('Server online')
        })
    }
}

const appInstance = new App(app)
appInstance.start()