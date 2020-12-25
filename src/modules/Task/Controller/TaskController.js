const CustomError = require('../../../utils/error/CustomError')
const Task = require('../Models/Task')
const escapeStringRegex = require('escape-string-regexp')

class TaskController {

    async list(req, res) {
        const page = parseInt(req.query.page || 0)
        const limit = parseInt(req.query.limit || 10)
        
        const search = {userCrt: req.user._id}
        if(req.query.q) search.title = new RegExp(escapeStringRegex(req.query.q), "i")

        const tasks = await Task.find(search).skip(limit * page).limit(limit)

        res.send(tasks)
    }

    async get(req, res) {
        const _id = req.params.id
        const task = await Task.findOne({_id, userCrt: req.user._id})
        if(!task) throw new CustomError('Tarefa não encontrada')

        res.send(task)
    }

    async create(req, res) {
        const taskData = req.body
        taskData.userCrt = req.user._id

        const task = new Task(taskData)
        await task.save()

        res.status(201).send(task)
    }

    async update(req, res) {
        const taskData = req.body
        const editableFields = Task.getEditableFields()
        if(!Object.keys(taskData).every((field) => editableFields.includes(field)))
            throw new CustomError('Informado campos não aceitos para edição')
        
        const task = await Task.findOne({_id:req.params.id, userCrt: req.user.id})
        if(!task) throw new CustomError('Tarefa não encontrada')
        
        Object.keys(taskData).forEach(field => task[field] = taskData[field])
        await task.save()

        res.send(task)
    }

    async delete(req, res) {
        const _id = req.params.id
        const task = await Task.findOne({_id, userCrt: req.user._id})
        if(!task) throw new CustomError('Tarefa não encontrada')

        await task.remove()

        res.send({msg: 'Tarefa removida com sucesso'})
    }

}

module.exports = TaskController