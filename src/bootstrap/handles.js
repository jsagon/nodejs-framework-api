import CustomError from "../utils/error/CustomError"

class Handles {

    constructor(app) {
        this._app = app
    }

    all = () => {
        this.onError()
    }

    /**
     * Registro de middleware de erro responsável por assegurar retorno da api 
     */
    onError = () => {
        this._app.use((error, req, res, next) => {
            res.status(error.httpStatusCode || 400)

            // Se for um CustomError significa que foi levantado intencionalmente com mensagem legivel
            if(error instanceof CustomError) {
                res.send({error:error.message})
            } else {
                res.send({error:'Ocorreu um erro na operação', exception: error.message})
            }
        })
    }
}

export default Handles