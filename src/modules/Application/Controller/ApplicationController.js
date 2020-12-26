class ApplicationController {

    /**
     * Criado apenas para fornecer informações adicionais de exemplo 
     */
    async get(req, res) {
        const info = {
            uris: {
                users: {
                    create: '/users',
                    login: '/users/login',
                    logout: '/users/logout',
                    logoutAll: '/users/logoutAll',
                    info: '/users/me',
                    delete: '/users/me',
                    update: '/users/me'
                },
                tasks: {
                    create: '/tasks',
                    list: '/tasks',
                    getOne: '/tasks/:id',
                    delete: '/tasks/:id',
                    update: '/tasks/:id',
                }
            },
            version: '1.0',
            github: 'https://github.com/jsagon/nodejs-framework-api',
            created_by: 'JSagon'
        }

        res.send(info)
    }

}

export default ApplicationController