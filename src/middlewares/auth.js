const jwt = require('jsonwebtoken')
const User = require('../modules/User/Models/User')

class Auth {

}

const auth = async (req, res, next) => {
    try {
        const authorization = req.header('Authorization')
        if(!authorization) throw new Error('Necessário autenticação')

        const token = authorization.replace('Bearer ', '')
        const tokenData = jwt.verify(token, process.env.JWT_SECRET_KEY)

        const user = await User.findOne({_id: tokenData._id, 'tokens.token': token})
        if(!user) throw new Error('Autenticação inválida')

        req.user = user
        req.authToken = token
    }
    catch(e) {
        return res.status(401).send({error: e.message})
    }

    next()
}

module.exports = auth