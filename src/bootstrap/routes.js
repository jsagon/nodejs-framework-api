import UserRoutes from '../modules/User/Config/Routes'
import TaskRoutes from '../modules/Task/Config/Routes'
import ApplicationRoutes from '../modules/Application/Config/Routes'

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
     * Lista de rotas a ser registrada na aplicação
     * @return array
     */
    getRoutesRegistered() {
        return [
            ApplicationRoutes,
            UserRoutes,
            TaskRoutes
        ]
    }

}

export default RoutesRegister