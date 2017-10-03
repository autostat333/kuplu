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
			obj = angular.toJSON(obj);

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
	this.interceptor = ['$rootScope','jwtHelper',function($rootScope, jwtHelper)
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
				
				return response;
				}
					
			
			};
		}]

		
		
		
		
	this.$get = ['$http','$rootScope','$mdDialog','$q','jwtHelper',function($http,$rootScope,$mdDialog,$q,jwtHelper)	
		{

		var proto_signUp = {
		isEmpty: function()
			{
			return !this.name||!this.password;
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
		
	



				
				
			logoout:function()
				{
				
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
					defer.resolve(response);
					}.bind(this),function(err)
						{
						alert(err.message);
						defer.resolve({Error:err.message});
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
					
					//token will de decoded and putted in rootScope in interceptor (above)
					defer.resolve(response);
					}.bind(this),function(err)
						{
						alert(err);
						defer.resolve({Error:err.message});
						})
					
					
				return defer.promise;
					
				},
				
				
			logout:function()
				{
				window.localStorage.removeItem('token');
				$rootScope.USER = false;
				window.location.reload();
				}
				
			}
		}]
	}
	
