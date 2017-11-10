module.exports = function accountProvider()
	{

	
	function handleToken(rootScope, token,jwt)
		{
		window.localStorage.setItem('token',token);
		rootScope.USER = jwt.decodeToken(token);
		
		}
	
	
	function encodeBase64(obj)
		{
		if (!obj) return obj;

		if (typeof obj=='object')
			obj = angular.toJson(obj);

		if (typeof obj=='string')
			{
			var encoded = btoa(obj);
			var position = parseInt((encoded.length+1)/2);
			var part_one = encoded.slice(0,position);
			var part_two = encoded.slice(position,encoded.length);
			
			return part_one+'a'+part_two;	
			}
			
		else
			return obj;

		}
	
	
	//interceptor is pushed in routes.js (config of angularjs)
	this.interceptor = ['$rootScope','jwtHelper','$injector',function($rootScope, jwtHelper,$injector)
		{
		return {
			'request':function(config)
				{
				var token = window.localStorage.getItem('token');
				if (token)
					config.headers['Authorization'] = 'Bearer '+token;
				if (!$rootScope.USER&&token)
					handleToken($rootScope,token,jwtHelper);
				return config;
				},
					
			'response':function(response)
				{
				if (response.data.token)
					handleToken($rootScope,response.data.token,jwtHelper);
				
				if (response.data.Error=='Token is expired'&&$rootScope.USER)
					{
					response.data.Error = '';
					$rootScope.USER = false;
					window.localStorage.removeItem('token');
					debugger;
					var $mdDialog = $injector.get('$mdDialog');
					$mdDialog.show($mdDialog
						.alert()
						.title('Упс,')
						.content('Истекло время сессии, вам необходимо перелогиниться!')
						.ok('OK!')).then(function()
							{
							window.location.reload();
							})
					}
				
				return response;
				}
					
			
			};
		}]

		
		
		
		
	this.$get = ['$http','$rootScope','$mdDialog','$q','jwtHelper',function($http,$rootScope,$mdDialog,$q,jwtHelper)	
		{
				
		function handleError(msg)
			{
			return $mdDialog.show($mdDialog
				.alert()
				.title('Гоп стоп,')
				.content(msg)
				.ok('Закрыть')
				)
			}		
		
		
		var proto_signUp = {
		isEmpty: function()
			{
			return !this.name||!this.password;
			},
			
		update:function()
			{
			var defer = $q.defer();
			var data = encodeBase64(this);
			$http.post('/api/profile/update',{'data':data}).then(function(response)
				{
				response = response.data;
				if (response.Error)
					{
					handleError(response.Error).then(function()
						{
						defer.resolve(response);
						})
					return false;
					}
				defer.resolve(response);
				},function(err)
					{
					handleError(err.Message).then(function(){defer.resolve({'data':'','Error':true})})
					}.bind(this))
					
			return defer.promise;
			},
			
		updatePassword:function(passObj)
			{
			var defer = $q.defer();
			var data = encodeBase64(passObj);
			$http.post('/api/password/update',{'data':data}).then(function(response)
				{
				response = response.data;
				if (response.Error)
					{
					handleError(response.Error).then(function()
						{
						defer.resolve(response);
						})
					return false;
					}
				defer.resolve(response);
				},function(err)
					{
					handleError(err.Message).then(function(){defer.resolve({'data':'','Error':true})})
					}.bind(this))
					
			return defer.promise;			
			}

		};

		
		var proto_login = {
		
		isEmpty:function()
			{
			return !this.name||!this.password;
			}
	
		};
		
		
		
		return {

			createBlankSignUp:function()
				{
				var obj = Object.create(proto_signUp);
				
				obj['name'] = '';
				obj['password'] = '';
				obj['phone'] = '';
				obj['visibleName'] = '';
				
				return obj;
				},
		

			createBlankLogin:function()
				{
				var obj = Object.create(proto_login);
					
				obj['name'] = '';
				obj['password'] = '';
					
				return obj;
				},

				
			login:function(data)
				{
				var defer = $q.defer();
				
				//to save original password in the input field
				//if password is wrong - user can continue typing, but password mustnt be rewrited with base64 in input
				data = $.extend(true,{},data); 
				
				if (data['password'])
					data['password'] = encodeBase64(data['password']);
				
				$http.post('/login',data).then(function(response)
					{
					response = response.data;
					//userError remains only this
					//in future should be Error  - to show from http callbacks
					//and userErrors - to show from controllers
					//from backend should come userError as simple object {data:'',Error:'',userError:''}
					if (response.Error&&!response.userError)
						{
						handleError(response.Error).then(function(){defer.resolve(response)});
						return false;
						}
					
					defer.resolve(response);
					}.bind(this),function(err)
						{
						var msg = !err?'Нет сообщений':err.message;
						handleError(err.message).then(function()
							{
							defer.resolve({'data':'','Error':''})
							})
						})
					
				return defer.promise;
					
				},
				
				
				
			signup:function(data)
				{

				var defer = $q.defer();
				
				//to save original password in the input field
				//if password is wrong - user can continue typing, but password mustnt be rewrited with base64 in input
				data = $.extend(true,{},data); 
				
				
				if (data['password'])
					data['password'] = encodeBase64(data['password']);

				if (data['phone'])
					data['phone'] = encodeBase64(data['phone']);
				
				
				$http.post('/signup',data).then(function(response)
					{
					response = response.data;
					//userError remains only this
					//in future should be Error  - to show from http callbacks
					//and userErrors - to show from controllers
					//from backend should come userError as simple object {data:'',Error:'',userError:''}
					if (response.Error&&!response.userError)
						{
						handleError(response.Error).then(function(){defer.resolve(response)})
						return false;
						}
						
					//token will de decoded and putted in rootScope in interceptor (above)
					defer.resolve(response);
					},function(err)
						{
						var msg = !err?'Нет сообщений':err.message;
						handleError(err.message).then(function()
							{
							defer.resolve({'data':'','Error':''})
							})
						})
					
					
				return defer.promise;
					
				},
				
				
			logout:function()
				{
				window.localStorage.removeItem('token');
				$rootScope.USER = false;
				window.location.reload();
				},
				
			saveAvatar:function(base64)
				{
				var defer = $q.defer();
				$http.post('/avatar/update',{'base64':base64}).then(function(response)
					{
					if (!response||!response.data)
						{
						defer.resolve({'data':'','Error':true});
						return false;
						}
					if (response.data.Error)
						{
						handleError(response.data.Error)
							.then(function()
								{
								defer.resolve({'data':'','Error':true});
								})
						return false;
						}
						
					response = response.data;
					defer.resolve(response);
					
					},function(err)
						{
						handleError('Произошла ошибка про отправке запроса на сохранение картинки!')
							.then(function()
								{
								defer.resolve({'data':'','Error':true});
								})
						})
				return defer.promise;
				}
	
			}
		}]
	}
	
