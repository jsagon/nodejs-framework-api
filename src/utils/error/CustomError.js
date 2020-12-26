function CustomError(message) {
    this.name = 'CustomError'
    this.message = message || 'Ocorreu um erro'
    this.stack = (new Error()).stack
}
CustomError.prototype = Object.create(CustomError.prototype)
CustomError.prototype.constructor = CustomError

export default CustomError