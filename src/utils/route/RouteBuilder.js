import CustomError from "../error/CustomError"

const RouterBuilder = class {
	
	constructor (router, uriBase, controller, middlewares) {
		this._router = router
		this._uri_base = uriBase
		this._controller = controller
		this._middlewares = middlewares ? (Array.isArray(middlewares) ? middlewares : [middlewares]) : null
		
		this._current_type_request = null
		this._current_type_method = null
		this._current_uri = null
		this._current_action = null
	}
	
	setRouter = (router) => {
		this._router = router
		return this
	}

	setBaseMiddlewares = (middlewares) => {
		this._middlewares = middlewares
		return this
	}

	setBaseController = (controller) => {
		this._controller = controller
		return this
	}

	setBaseUri = (uri) => {
		this._uri_base = uri
		return this
	}

	get = (params) => {
		this._registerRoute('get', params)
		return this
	}
	
	getOne = (params) => {
		this._registerRoute('get', params, 'getOne')
		return this
	}
	
	post = (params) => {
		this._registerRoute('post', params)
		return this
	}
	
	patch = (params) => {
		this._registerRoute('patch', params)
		return this
	}
	
	del = (params) => {
		this._registerRoute('delete', params)
		return this
	}
	
	_registerRoute = (typeRequest, params = {}, typeMethod) => {
		this._manageBase(params, typeRequest, typeMethod)
		
		const uri = this._generateUri()
		const action = this._generateAction()
		
		let routesConfig = [uri]
		routesConfig = this._manageMiddlewares(routesConfig)
				
		routesConfig.push(async (...p) => {
			try {
				await (new this._controller())[action](...p)
			}
			catch(e) {
				e.httpStatusCode = (e instanceof CustomError) ? 400 : 500
				return p[2](e) // next
			}
		})

		this._router[typeRequest](...routesConfig)
	}
	
	_manageBase = ({uri_base, uri, controller, action, middlewares}, typeRequest, typeMethod) => {
		if(uri_base) this._uri_base = uri_base
		if(controller) this._controller = controller
		if(middlewares) this._middlewares = middlewares
		
		this._current_uri = uri 
		this._current_action = action
		
		this._current_type_request = typeRequest
		this._current_type_method = typeMethod
	}
	
	_generateAction = () => {
		return this._current_action || this._getDefaultAction(this._current_type_method || this._current_type_request)
	} 
	
	_generateUri = () => {
		const uri = this._current_uri || this._getDefaultUri(this._current_type_method || this._current_type_request)
		return this._uri_base + uri
	}
	
	_manageMiddlewares = (routesConfig) => {
		if(!this._middlewares) return routesConfig
		routesConfig = routesConfig.concat(this._middlewares)
		
		return routesConfig
	}
	
	_getDefaultAction = (type) => {
		switch(type) {
			case 'get': return 'list'
			case 'getOne': return 'get'
			case 'post': return 'create'
			case 'patch': return 'update'
			case 'delete': return 'delete'
			default: return '';
		}
	}
	
	_getDefaultUri = (type) => {
		switch(type) {
			case 'getOne': 
			case 'patch':
			case 'delete': 
				return '/:id'			
		}
		
		return ''
	}
}

export default RouterBuilder