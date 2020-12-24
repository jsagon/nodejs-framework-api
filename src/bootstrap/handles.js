const CustomError = require("../utils/error/CustomError")

class Handles {

    constructor(app) {
        this._app = app
    }

    all = () => {
        this.error()
    }

    /**
     * registro do middleware ultimo de errors
     */
    error = () => {
        this._app.use((error, req, res, next) => {
            res.status(error.httpStatusCode)

            if(error instanceof CustomError) {
                res.send({error:error.message})
            } else {
                res.send({error:'Ocorreu um erro na operação', exception: error.message})
            }
        })
    }
}

module.exports = Handles