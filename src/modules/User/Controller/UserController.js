const User = require('../Models/User')

class UserController {

    async login (req, res) {
        const userData = req.body
        
        const user = await User.findByCredentials(userData.email, userData.password)
        const token = await user.generateAuthToken()

        res.send({user, token})
    }

    async create(req, res) {
        const userData = req.body

        const user = new User(userData)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }

    async update(req, res) {
        const userData = req.body
        const editableFields = User.getEditableFields()

        if(!Object.keys(userData).every((field) => editableFields.includes(field))) {
            return res.status(401).send({error:'Campos inválidos para edição'})
        }
        
        const user = req.user
        Object.keys(userData).forEach((field) => user[field] = userData[field])
        await user.save()
        
        res.status(200).send({user})
    }

    async logout(req, res) {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.authToken)
        await req.user.save()
        res.send({msg: 'Deslogado com sucesso'})
    }

    async logoutAll(req, res) {
        req.user.tokens = []
        await req.user.save()
        res.send({msg: 'Todas as sessões foram deslogadas com sucesso'})
    }

    async delete(req, res) {
        await req.user.remove()
        res.send(req.user)
    }

    async get (req, res) {
        res.send(req.user)
    }

}

module.exports = UserController