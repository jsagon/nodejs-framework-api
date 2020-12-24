function CustomError(message) {
    this.name = 'CustomError'
    this.message = message || 'Mensagem de erro padrão'
    this.stack = (new Error()).stack
}
CustomError.prototype = Object.create(CustomError.prototype)
CustomError.prototype.constructor = CustomError

module.exports = CustomError