/**
 * Tratamento de erros levantados pelo mongoose após tentativa de persistência
 * Obs.: Implementado para fornecer uma padronização de retorno da api relacionado ao mongoose com
 * textos de fácil compreensão
 * 
 * @param {*} schema 
 * @param {*} param1 
 */
const onPostSaveError = function(schema, {labels}) {
    schema.post('save', async function(error, doc, next) {
        const errorsMongo = error.errors
        if(!errorsMongo) {
            // tratamento de erros de chave unica
            if(error.name === "MongoError" && error.code === 11000) {
                const errors = Object.keys(error.keyValue).map(field => {
                    return {[field]: `Já existe um registro com esse ${labels[field]}`}
                })
                error.message = {validation: errors}
            }

            return next()
        }
        
        const errors = {}
        Object.keys(errorsMongo).forEach(field => {
            errors[field] = errorsMongo[field].properties.message
        })
        error.message = {validation: errors}
        next()
    })
} 

export {onPostSaveError}