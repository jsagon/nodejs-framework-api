const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const CustomError = require('../../../utils/error/CustomError')
const { onPostSaveError } = require('../../../utils/error/HandleMongooseError')

console.log(process.env.NODE_PATH)
console.log(process.cwd())

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nome obrigatório'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'E-mail obrigatório'],
        trim:true,
        lowercase:true,
        unique:[true, 'Teste'],
        validate: (value) => {
            if(!validator.isEmail(value)) throw new CustomError('E-mail inválido')
        }
    },
    password: {
        type: String,
        required: [true, 'Senha obrigatória'],
        minlength: [3, 'Senha deve conter no mínimo 3 digitos']
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.pre('save', async function(next) {
    
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    
    next()
})


onPostSaveError(userSchema, {labels:{email: 'E-mail'}})

userSchema.statics.findByCredentials = async function(email, password) {
    const user = await User.findOne({email})
    if(!user) throw new CustomError('E-mail ou senha incorreto')

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) throw new CustomError('E-mail ou senha incorreto')

    return user
}

userSchema.methods.generateAuthToken = async function() {
    const token = await jwt.sign({_id:this._id.toString()}, process.env.JWT_SECRET_KEY)

    this.tokens = this.tokens.concat({token})
    await this.save()

    return token
}

userSchema.methods.toJSON = function () {
    const user = this.toObject()

    delete user.tokens
    delete user.password
    delete user.__v

    return user
}

userSchema.statics.getEditableFields = function () {
    return Object.keys(userSchema.paths).filter((field) => !['_id','tokens'].includes(field))
}

const User = mongoose.model('User', userSchema)


module.exports = User