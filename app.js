const express = require('express') 
const app = express()

class App {

    constructor(app) {
        this.app = app 
        
        //inicializações
        this._configRoutes()
    }

    /**
     * Inicializa a configuração das rotas da aplicação
     */
    _configRoutes () {
        this.app.get('/', (req, res) => res.send('teste'))
    }

    /**
     * Inicializa o servidor
     */
    start() {
        this.app.listen(process.env.PORT, () => {
            console.log('Server online')
        })
    }
}

const appInstance = new App(app)
appInstance.start()