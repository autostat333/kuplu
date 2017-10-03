module.exports = function AccountCntr(db,jwt,config,async,userError)
	{
		

		
	var $scope = {};
	
	
	$scope.login = login;
	$scope.signup = signup;
	
	
	
	$scope.validateForSignUp = validateForSignUp;
	$scope.validateForLogin = validateForLogin;
	$scope.getUser = getUser;
	$scope.checkUserExistance = checkUserExistance;
	$scope.checkUserPassword = checkUserPassword;
	$scope.insertUser = insertUser;

	$scope.encode = encode; //for JWT
	
	
	$scope.encodeBase64 = encodeBase64; 
	$scope.decodeBase64 = decodeBase64; //decode from frontend password and phone
	
	function login(data,callback)
		{
		try
			{
			$scope.data = data;
			if (!data) throw new Error("Empty objet when tyries to login!");
			
			data['password'] = decodeBase64(data['password']);
			
			async.series([
				$scope.validateForLogin,
				$scope.getUser,
				$scope.checkUserPassword
				],function(err,res)
				{
				try
					{
					if (err&&!(err instanceof userError))
						throw err;
					if (err&&(err instanceof userError))
						{
						callback(null,err);
						return false;
						}
						
					//get new jwt and asign to user
					var data = {};
					data['Error'] = '';
					data['user'] = $scope.usersFromDb[0];
					
					delete data['user']['password'];
					var token = $scope.encode(data['user'],config.SECRET);
					data['token'] = token;
					callback(null,data);
					}
					
				catch(err){err.message+='; Some problems in login callback for async function!';callback(err)}
				})
				
			}
			
		catch(err){callback(err)}
		}
	

	
	function encode(user)
		{
		return jwt.sign(user,config.SECRET,{'expiresIn':'24h'}); //expires in 24H
		}


		
	
	function signup(data,callback)
		{
		if (data)
			{
			data['password'] = decodeBase64(data['password']);
			data['phone'] = decodeBase64(data['phone']);
			}
		$scope.data = data;
		async.series([
			$scope.validateForSignUp,
			$scope.getUser,
			$scope.checkUserExistance,
			$scope.insertUser
			
			],function(err,res)
			{
			try
				{
				//not expected errors
				if (err&&!(err instanceof userError))
					throw err;
				
				//existed user
				if (err&&(err instanceof userError))
					{
					callback(null,err);
					return false;
					}
				
				
				var data ={};
				data['user'] = $scope.signUpUser;
				delete data['user']['password'];
				data['token'] = $scope.encode(data['user']);
				callback(null,data);				
				}
			catch(err){callback(err)};
				
			})
				
		}
		
		
	function validateForSignUp(callback)
		{
		try
			{
			if (!$scope.data) throw new Error('Empty data from client');
			var res = [];
			
			res.push(($scope.data['visibleName'].isValidFor('userName')));
			res.push(($scope.data['name'].isValidFor('email')));
			res.push(($scope.data['phone'].isValidFor('phone')));
			res.push(($scope.data['password'].isValidFor('password')));
			
			for (var each in res)
				{
				if (res[each]!==true)
					{
					var err = new userError(res[each]);
					callback(err);
					return false;
					}
				}
			callback();
			
			}
		catch(err){err.message+='; Problems when validation object properties when signUp!';callback(err)}
		}
		
		
		
	function validateForLogin(callback)
		{
		try
			{
			if (!$scope.data) throw new Error('Empty data for login');
			
			var res = [];
			res.push($scope.data['name'].isValidFor('userName'));
			res.push($scope.data['password'].isValidFor('password'));
			
			for (var i=0;r = res[i++];)
				{
				if (r!=true)
					{
					var err = new userError(r);
					callback(err);
					return false;
					}
				}
			callback();
			
			}
		catch(err){err.message+="; Something bad when validate for Login data in accountCntr!";callback(err)}
			
		}
		
		
	function getUser(callback)
		{
		try
			{
			if (!$scope.data['name'])
				throw new Error("Cannot get user. No name passed to signup!");

			$scope.usersFromDb = [];
		
			cursor = db.collection('users').find({'name':$scope.data['name']})
		
			cursor.each(function(err,item)
				{
				try
					{
					if (err){throw err};
					
					if (!item)
						{
						callback();
						return false;
						}
					$scope.usersFromDb.push(item);
				
					}
				catch(err){err.message+="; Error from server when obtain user from DB"; callback(err)}
				})
			}
		catch(err){err.message+="; Cannot start request to DB to obtain new user!";callback(err);}
		}
		
		
		
	
	function checkUserExistance(callback)
		{
		try
			{
			//user is already existed
			if ($scope.usersFromDb.length)
				{
				var err = new userError('Пользователь с именем '+$scope.data['name']+'  уже зарегистрирован!'); 
				callback(err);
				return false;
				}
			callback();
			}
		catch(err){err.message+='; CheckUserInstance() failed!';callback(err);}
		}
		
	
	function checkUserPassword(callback)
		{
		try
			{
			//user is not existed
			if (!$scope.usersFromDb.length)
				{
				var err = new userError('Пользователь с именем '+$scope.data['name']+'  не зарегистрирован!'); 
				callback(err);
				return false;
				}
				
			//check password
			if ($scope.data['password']!=$scope.usersFromDb[0]['password'])
				{
				var err = new userError(('Пароль введен неверно для пользователя '+$scope.data['name']+'!'));
				callback(err);
				return false;
				}
				
				
			callback();
			}
		catch(err){err.message+='; CheckUserInstance() failed!';callback(err);}
		}	
	

	function insertUser(callback)
		{
		try
			{
			if (!$scope.data) throw new Error("; Empty user data when insert new user!");
			
			db.collection('users').insert($scope.data,function(err,res)
					{
					try
						{
						if (err) throw err;
						$scope.signUpUser = res['ops'][0];
						callback();
						}
					catch(err){err.message+="; Callback after insert user has not been finished correctly!";callback(err);}
					})
					
			}
		catch(err){err.message+="; Cannot start insert new user to DB!";callback(err);}
					
		}
		
		
	function encodeBase64(obj)
		{
		if (!obj) return obj;
		if (typeof obj=='object')
			obj = JSON.stringify(obj);

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
	
	
	function decodeBase64(encoded)
		{
		if (!encoded||typeof encoded!='string') return encoded;

		var position = parseInt(encoded.length/2);
		var part_one = encoded.slice(0,position);
		var part_two = encoded.slice(position+1,encoded.length);
		
		var decoded = (new Buffer((part_one+part_two),'base64')).toString();
		
		return decoded;

		}
	
			
		
		
	
	
	return $scope;
		
	}