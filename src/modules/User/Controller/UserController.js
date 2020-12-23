const User = require('../Models/User')

class UserController {

    async create(req, res) {
        const userData = req.body

        try {
            const user = new User(userData)
            await user.save()

            res.status(201).send({user})
        }
        catch(e) {
            res.status(500).send({error: e.message})
        }
    }

    async login (req, res) {
        const userData = req.body
        try {
            const user = await User.findByCredentials(userData.email, userData.password)
            const token = await user.generateAuthToken()

            res.send({user, token})
        }
        catch(e) {
            res.status(500).send({error: e.message})
        }
    }

    async logout(req, res) {
        try {
            req.user.tokens = req.user.tokens.filter((token) => token.token !== req.authToken)
            await req.user.save()
            res.send({msg: 'Deslogado com sucesso'})
        }
        catch(e) {
            res.status(500).send({error: e.message})
        }
    }

    async logoutAll(req, res) {
        try {
            req.user.tokens = []
            await req.user.save()
            res.send({msg: 'Todas as sessões foram deslogadas com sucesso'})
        }
        catch(e) {
            res.status(500).send({error: e.message})
        }
    }

    async get (req, res) {
        res.send(req.user)
    }

}

module.exports = UserController