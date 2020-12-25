const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 124
    },
    description: {
        type: String
    },
    completed: {
        type: Boolean,
        required: true, 
        default: 0,
    },
    userCrt: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

taskSchema.statics.getEditableFields = function () {
    return Object.keys(taskSchema.paths).filter((field) => !['_id', 'userCrt'].includes(field))
}

const Task = mongoose.model('Task', taskSchema)

module.exports = Task