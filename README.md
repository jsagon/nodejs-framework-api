# NodeJS Framework API

> Estrutura, helpers e mecanismos que facilitam o desenvolvimento de uma API de fácil e rápida implementação, e completamente customizável.

<!--Primeiramente, não se trata de um Package a ser instalado como dependência do projeto, mas sim o próprio projeto propriamente dito.
Obs.: Versão em TypeScript em desenvolvimento, e futuramente com intenção de estruturar como Package npm.-->

### Sumário

- [Descrição](#descrição)
- [Instalação e Configuração](#instalação-e-configuração)
- [Entendendo a arquitetura](#entendendo-a-arquitetura)
- [Criando um módulo - Exemplo](#criando-um-módulo---exemplo)
- [Consumo da API e Demo](#consumo-da-api-e-demo)
- [Automação de Testes](#automação-de-testes)
- [Futuro e novas funcionalidades](#futuro-e-novas-funcionalidades)
- [Autor Info](#autor-info)

---

## Descrição

A Framework tem como propósito inicial mostrar a simplicidade de implementação de um projeto NodeJS, funcionando também como um modelo para ensino e estudo.

Para aqueles que preferem não utilizar uma framework muito robusta como o NestJS, mas ainda assim não abrir mão de determinadas facilidades, aqui encontrarão uma abordagem estrutural similar, e completamente customizável sem perder a escalabilidade para um projeto maior.

Por padrão, o projeto já vem com uma mini implementação de autenticação de usuário e criação de tarefas para exemplificar a implementação, e visando também aqueles que querem apenas testar integrações.

---

## Instalação e Configuração

#### Instalação
Por abrir mão de ser um Package em prol de dar uma liberdade mais ampla ao desenvolvedor, o download deverá ser realizado por meio do próprio repositório.

```shell
git clone https://github.com/jsagon/nodejs-framework-api.git
```

Para instalação das dependências da Framework, entre na pasta e rode o comando

```
npm install
```

#### Configuração

Na pasta /config, possui um arquivo de exemplo das variáveis a serem utilizadas na aplicação. Renomeie o arquivo ou crie um novo apenas ".env"

Configuração do arquivo até o momento: 
``` 
PORT=3000
DATABASE_MAIN=mongodb://127.0.0.1:27017/<nome da base de dados aqui>
#exemplo: DATABASE_MAIN=mongodb://127.0.0.1:27017/task-manager-api
JWT_SECRET_KEY='Insira a sua chave secreta aqui'
``` 
Obs.: O projeto utiliza o MongoDB e Mongoose na implementação de exemplo. Fique a vontade para utilizar outro banco de dados e outras ferramentas como o Sequelize.

Por motivos de segurança, não existe um arquivo específico para ambiente de produção para não correr o risco de envio junto aos arquivos do projeto. Recomendo setar ou criar diretamente na hospedagem que utilizar. 

#### Inicializando

```
npm run dev
```

Se tudo ocorrer bem, será mostrado a mensagem "Server online". Indo a url http://localhost:3000/ você provavelmente verá um retorno da API com informações resumidas da aplicação.

Resumo do exemplo de retornado 
```
{
  "uris": {
    "users": {
      "create": "/users",
      "login": "/users/login",
      "logout": "/users/logout"
		  ...
    },
    "tasks": {
      "create": "/tasks",
      "list": "/tasks",
      "getOne": "/tasks/:id",
      ...
    }
  },
  "version": "1.0",
  "github": "https://github.com/jsagon/nodejs-framework-api",
  "created_by": "JSagon"
}
```
Obs.: Fique a vontade para modificar como quiser.

---

## Entendendo a arquitetura

A estrutura de diretórios bem como determinadas funcionalidades se assemelham bastante a outras frameworks como Laravel e Zend Framework. Fornecendo assim, melhor divisão das implementações e entendimento para aqueles que estão migrando.

Exemplo da estrutura:
```
config
  .env
src
  bootstrap
  database
  middlewares
  modules
    User
      Config
        Routes.js
      Controller
        UserController.js
      Models
        User.js
  utils
    error
      CustomError.js
    route
      RouteBuilder.js
		
```

#### Funcionalidades especiais

**RouteBuilder**

> Construção de rotas abstraindo as complexidades de cada implementação e registro na aplicação. Tratamento de exceções padrões, instância única de controlador por requisição para evitar conflitos indesejados, uris padrões, entre outros.
 
Abaixo um exemplo de um CRUD padrão com autenticação 

**Sem o uso** do RouteBuilder desenvolvido nesta framework
```
const router = express.Router()

router.post('/tasks', authMiddleware, async (req, res) => {
    try {
       ...
    } catch(e) {
        res.status(500).send(e)
    }
})

router.get('/tasks', authMiddleware, async (req, res) => {
    try {
        ...
    } catch(e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', authMiddleware, async (req, res) => {
    try {
        ...
    } catch(e) { 
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', authMiddleware, async (req, res) => {
    try{
        ...
    } catch(e) {
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', authMiddleware, async (req, res) => {
    try {
        ...
    } catch(e) {
        res.status(500).send(e)
    }
})
```

**Com o uso** do RouteBuilder desenvolvido nesta framework
```
const router = express.Router()

new RouteBuilder(router, '/tasks', TaskController, authMiddleware)
    .get()
    .getOne()
    .post()
    .patch()
    .del()
```

Exemplo mais complexo envolvendo uris e actions customizáveis
```
new RouteBuilder(router, '/users', UserController)
    //sem middleware de autenticação
    .post()
    .post({uri:'/login', action:'login'})
    //com middleware de autenticação
    .setBaseMiddlewares([authMiddleware])
    .get({uri:'/me', action:'get'})
    .post({uri:'/logout', action:'logout'})
    .patch({uri:'/me', action:'update'})
```

**RoutesRegister**

O arquivo /src/bootstrap/routes.js (RoutesRegister) fornece um modelo fácil para registro das rotas do sistema, sendo necessário apenas inserir o arquivo Routes.js do módulo em questão.
> Funcionalidade em desenvolvimento: Registro automático das rotas sem a necessidade de setar manualmente.

**CustomError**

O arquivo /src/utils/error/CustomError.js (CustomError) fornece uma interface de erro padrão quando necessário levantar exceção. A utilidade dessa exception está no tratamento automático das rotas ao identificar um erro levantado, e retornar de forma padronizada.

**HandleMongooseError**

O arquivo /src/utils/error/HandleMongooseError.js fornece métodos para tratamento dos erros levantados especificamente no Mongoose. Devido a estrutura da exceção servir um padrão não muito interessante para retorno da API, os métodos deste arquivo fornecem uma padronização de retorno.

Quando por exemplo, o mongoose levanta um erro de chave única, a mensagem é ilegível para o usuário final e necessitando de um tratamento por parte do programador.

Um exemplo de retorno utilizando os métodos do HandleMongooseError:
```
{
  validation: {
    email: 'Este e-mail já se encontra em nossos registros'
  }
}
```
---

## Criando um módulo - Exemplo

> Exemplo simplificado da criação de um módulo novo para a aplicação. Passo a passo

Exemplo de criação de um módulo de Boas Vindas.

Primeiro construiremos a estrutura de pastas e arquivos
```
src
  modules
    Welcome
      Config
        Routes.js
      Controller
        WelcomeController.js
```

Agora, editaremos o arquivo WelcomeController.js. Criaremos a classe do controlador e um método inicial

```
class WelcomeController {
  async index (req, res) {
    res.send({msg:'Bem-vindo a sua primeira implementação'})
  }
}

export default WelcomeController 
```

Em seguida, editaremos a classe Routes.js da seguinte forma
```
import WelcomeController from '../Controller/WelcomeController'
import RouteBuilder from '../../../utils/route/RouteBuilder'
import express from 'express'
const router = express.Router()

new RouteBuilder(router, '/welcome', WelcomeController)
  .get({uri:'/', action:'index'})

export default router
```

Agora só nos resta registrá-la no RoutesRegister.js
```
...
import WelcomeRoutes from '../modules/Welcome/Config/Routes'

...
getRoutesRegistered() {
  return [
    ...
    WelcomeRoutes
  ]
}
```

Reiniciando a aplicação, caso não esteja utilizando o nodemon, e acessando a url http://localhost:3000/welcome você deverá ver a sua primeira action sendo retornada.

---

## Consumo da API e Demo

> A explicação é a partir de uma url online, mas as chamadas são igualmente para o localhost. 
Obs.: Para aqueles que desejam utilizar a url online para testes de integração, com apps mobile ou outros, é preciso ter ciência de que a base de dados está programada para limpar-se de tempo em tempo. Não utilizar para produção.

Exemplos de consumo da API com autênticação

url: https://jsagon-task-manager-api.herokuapp.com

Criação de usuário e retorno:
```
// post {url}/users
{
    "name": "User Test",
    "password": "usertest",
    "email": "usertest@user.com"
}

// Retorno
{
    "user": {
        "_id": "5fe8d557206c05001791f5e1",
        "name": "User Test",
        "email": "usertest@user.com",
        "createdAt": "2020-12-27T18:41:27.074Z",
        "updatedAt": "2020-12-27T18:41:27.169Z"
    },
    "token": "..."
}
```

Login de usuário e retorno:
```
// post {url}/users/login
{
    "password": "usertest",
    "email": "usertest@user.com"
}

// Retorno
{
    "user": {
        "_id": "5fe8d557206c05001791f5e1",
        "name": "User Test",
        "email": "usertest@user.com",
        "createdAt": "2020-12-27T18:41:27.074Z",
        "updatedAt": "2020-12-27T18:41:27.169Z"
    },
    "token": "..."
}
```

Criação de uma Tarefa e retorno.

Obs.: Por necessitar de autenticação, será preciso passar o Token no cabeçalho da requisição
```
// post {url}/tasks
// Authorization: Bearer <token>
{
    "title": "Tarefa de testes",
    "description": "...",
    "completed": true
}

// Retorno
{
    "completed": true,
    "_id": "5fe8d683206c05001791f5e4",
    "title": "Tarefa de testes",
    "userCrt": "5fe8d557206c05001791f5e1",
    "createdAt": "2020-12-27T18:46:27.843Z",
    "updatedAt": "2020-12-27T18:46:27.843Z",
}
```

> Para outras ações, verificar actions retornadas no resumo inicial ou no código internamente. Não inserido aqui para não ficar muito extenso.

---

## Automação de Testes

> Certificar-se de que os recursos foram implementados corretamente nunca é demais ^^

Por padrão, esta framework já vem com uma configuração para testes utilizando o Jest, e uma pasta para os códigos de implementação. Sendo eles na raiz do projeto, ./tests, e um arquivo com testes iniciais ./tests/simple.test.js.

Para executar os testes, utilize o comando a seguir:
```
npm test
```

Provavelmente ao final da execução, você verá o resultado como na imagem seguinte:

![tests](https://user-images.githubusercontent.com/11699360/103250978-64601b80-4955-11eb-9ce8-1c65d573d09c.JPG)


---

## Futuro e novas funcionalidades

Apesar da proposta inicial de ser uma Framework básica, o projeto ainda tem variadas funcionalidades para acrescentar. 

Dentre as funcionalidades, estão:
- Versão completamente em TypeScript.
- Registro dos módulos e rotas dinamicamente, removendo a necessidade manual.
- Arquitetura monorepo para múltiplas aplicações. 
- Implementação front-end: Views. MVC.
- Abstração para o Fastify além do já Express.

---

## Autor Info

Nome: Jhonatan Gonçalves<br>
Alias: JSagon<br>
Linkedin: https://www.linkedin.com/in/jhonatan-goncalves/<br>
E-mail: na descrição do github<br>


