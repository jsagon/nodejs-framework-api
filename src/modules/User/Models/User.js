const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim:true,
        lowercase:true,
        unique:true,
        validate: (value) => {
            if(!validator.isEmail(value)) throw new Error('E-mail inválido')
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 3
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.pre('save', async function(next) {
    
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    
    next()
})

userSchema.statics.findByCredentials = async function(email, password) {
    const user = await User.findOne({email})
    if(!user) throw new Error('E-mail ou senha incorreto')

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) throw new Error('E-mail ou senha incorreto')

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

    //delete user.tokens
    delete user.password

    return user
}

const User = mongoose.model('User', userSchema)


module.exports = User