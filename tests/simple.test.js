import './_base'
import appInstance from '../app'
import request from 'supertest'
import User from '../src/modules/User/Models/User'
import Task from '../src/modules/Task/Models/Task'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const idUserOne = new mongoose.Types.ObjectId()
const userOne = {
    _id: idUserOne, 
    name: 'Test 1',
    email: 'teste1@teste.com',
    password: '123456',
    tokens: [{
        token: jwt.sign({_id: idUserOne}, process.env.JWT_SECRET_KEY)
    }]
}

const idUserTwo = new mongoose.Types.ObjectId()
const userTwo = {
    _id: idUserTwo, 
    name: 'Test 2',
    email: 'teste2@teste.com',
    password: '321321321',
    tokens: [{
        token: jwt.sign({_id: idUserTwo}, process.env.JWT_SECRET_KEY)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Tarefa 1',
    description: 'Criar lista',
    userCrt: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Tarefa 2',
    description: 'Criar lista'
}

beforeEach(async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
})

test('Criação de usuário', async () => {
    const user = await request(appInstance.getApp()).post('/users').send({
        name: 'Test 2',
        email: 'teste_crt@teste.com',
        password: '123789'
    }).expect(201)
})

test('Login de usuário dados corretos', async () => {
    await request(appInstance.getApp()).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('Login com dados incorretos - levantar erro', async () => {
    await request(appInstance.getApp()).post('/users/login').send({
        email: userOne.email,
        password: 'senhainvalida'
    }).expect(400)
})

test('Tarefa criação - erro sem autenticação', async () => {
    await request(appInstance.getApp()).post('/tasks').send(taskTwo).expect(401)
})

test('Tarefa criação com autenticação correta', async () => {
    await request(appInstance.getApp())
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(taskTwo)
        .expect(201)
})

test('Tarefa - erro usuario 2 pegar task usuario 1', async () => {
    await request(appInstance.getApp())
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send(taskOne)
        .expect(400)
})