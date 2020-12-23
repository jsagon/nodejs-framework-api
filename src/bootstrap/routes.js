const UserRoutes = require('../modules/User/Config/Routes')

class RoutesRegister {
        
    constructor(app) {
        this.app = app
    }

    /**
     * Registro das rotas 
     */
    load() {
        const self = this
        const routes = this.getRoutesRegistered()
        routes.forEach(router => {
            self.app.use(router)
        });
    }

    /**
     * Recupera a lista de rotas a ser registrada na aplicação
     * @return array
     */
    getRoutesRegistered() {
        return [
            UserRoutes
        ]
    }

}

module.exports = RoutesRegister