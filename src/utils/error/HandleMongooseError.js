// Tratamento de errors para ficar compreensivel no retorno das chamadas
const onPostSaveError = function(schema, {labels}) {
    schema.post('save', async function(error, doc, next) {
        const errorsMongo = error.errors
        if(!errorsMongo) {
            // chave unica
            if(error.name === "MongoError" && error.code === 11000) {
                const errors = Object.keys(error.keyValue).map(field => {
                    return {[field]: `Já existe um registro com esse ${labels[field]}`}
                })
                error.message = JSON.stringify(errors)
            }

            return next()
        }
        const errors = {}
        Object.keys(errorsMongo).forEach(field => {
            errors[field] = errorsMongo[field].properties.message
        })
        error.message = JSON.stringify(errors)
        next()
    })
} 

export {onPostSaveError}