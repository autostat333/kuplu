module.exports = function AccountCntr(db,jwt,config,async,userError)
	{
		
	var fs = require('fs');
	var jdenticon = require('jdenticon'); //for creating blank icons
	var ObjectId = require('mongodb').ObjectId;
		
	var $scope = {};
	
	
	$scope.login = login;
	$scope.signup = signup;
	
	
	
	$scope.validateForSignUp = validateForSignUp;
	$scope.validateForLogin = validateForLogin;
	$scope.getUser = getUser;
	$scope.checkUserExistance = checkUserExistance;
	$scope.checkUserPassword = checkUserPassword;
	$scope.insertUser = insertUser;
	$scope.createNewAvatar = createNewAvatar;
	$scope.updateAvatar = updateAvatar;
	$scope.updateProfile = updateProfile;
	$scope.updatePassword = updatePassword;
	$scope.sendToken = sendToken;

	$scope.encode = encode; //for JWT
	$scope.getAvatarFolder = getAvatarFolder;
	
	
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
					$scope.sendToken('; Some problems in login callback for async function!',err,res,callback);
					})
			}
		catch(err){callback(err)}
		
		}
	

		
	
	function signup(data,callback)
		{
		
		if (data)
			{
			data['password'] = decodeBase64(data['password']);
			data['phone'] = decodeBase64(data['phone']);
			data['created'] = new Date();
			data['avatarUrl'] = $scope.getAvatarFolder()+$scope.encodeBase64((new Date())*1+'_'+data['name'])+'.png'; //png because default image in png format
			}
			
		$scope.data = data;
		
		async.series([
			$scope.validateForSignUp,
			$scope.getUser,
			$scope.checkUserExistance,
			$scope.insertUser,
			$scope.createNewAvatar,
			$scope.getUser
			],function(err,res)
				{
				$scope.sendToken('; Some problems to signUp (error in async callback for login)',err,res,callback);
				})

		
		}
		
	function sendToken(errMsg,err, res,callback)
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
			data['user'] = $scope.usersFromDb[0];
			delete data['user']['password'];
			data['token'] = $scope.encode(data['user']);
			callback(null,data);				
			}
		catch(err)
			{
			if (err instanceof userError)
				{
				callback(null,{'data':'','Error':err.Error,'userError':true});
				return false;
				}
			if (err) {err.message+='; '+errMsg+'!';callback(err);return false}
			};
			
		}
		
		
	function validateForSignUp(callback,woPass)
		{
		try
			{
			if (!$scope.data) throw new Error('Empty data from client');
			var res = [];
			
			res.push(($scope.data['visibleName'].isValidFor('userName')));
			res.push(($scope.data['name'].isValidFor('email')));
			res.push(($scope.data['phone'].isValidFor('phone')));
			if (!woPass)
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
		
		
	function getUser(callback,byId)
		{
		try
			{
			if (!$scope.data['name']&&!byId)
				throw new Error("Cannot get user. No name passed to signup!");

			//byIs means search by ID, comes from updateUser
			if (byId)
				var find = {'_id':ObjectId(byId)};
			else
				var find = {'name':$scope.data['name']};
			
			$scope.usersFromDb = [];
		
			cursor = db.collection('users').find(find)
		
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
		catch(err){err.message+='; CheckUserPassword() failed!';callback(err);}
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
		
		
	function createNewAvatar(callback)
		{
		try
			{
			var img = jdenticon.toPng($scope.data['name']+((new Date())*1),200);
			fs.writeFile($scope.data['avatarUrl'],img,callback); //avatar URL contain ext .png
			}
		catch(err)
			{
			err.message+='; Some problems when create new avatar';
			callback(err);
			return false;
			}
		
		}
		
		
	//should be object as req {'base64':'','avatarUrl':''}
	function updateAvatar(req,callback)
		{
		try
			{

			var file_ext = req.body.base64.replace(/^data:image\/([^;]+);base64.*/,'$1');
			var imgName = req.USER['avatarUrl'].replace(/^(.+)\.[^.]+$/,'$1')+'.'+file_ext;

			var base64 = req.body.base64.replace(/^.+;base64,(.+)/,'$1');
			if (!file_ext
				||(file_ext.length>10&&file_ext.length<3)
				||(!base64)
				||(base64.length>10&&base64.length<3)
				) throw new Error('Parsing base64 occured with errors!');
				
			//check whether slash is existed
			
			async.series([
				function removeFile(callback){fs.unlink(req.USER['avatarUrl'],callback)},
				function writeFile(callback){fs.writeFile(imgName,base64,'base64',callback);},
				function updateUserProfile(callback)
					{
					db.collection('users').update({'_id':ObjectId(req.USER._id)},{'$set':{'avatarUrl':imgName}},callback);
					}
			],function(err,res)
				{
				try
					{
					if (err) throw err;
					$scope.data = $scope.data||{};
					$scope.data['name'] = req.USER['name'];
					$scope.getUser(function(err,res)
						{
						$scope.sendToken('; Errors when send Token',err,res,callback);
						})
					}
				catch(err){err.message+='; Problems to write to file new avatar or update in collection new Avatar Url';callback(err)};
				})
			
			}

		catch(err)
			{
			err.message+='; Problems to parse avatar base64 data!';
			callback(err);
			return false;
			}
			
		}
			
		
	function updateProfile(req,callback)
		{
		try
			{
			var data = JSON.parse(decodeBase64(req.body.data));
			$scope.data = {};
			$scope.data['name'] = data['name'];
			$scope.data['visibleName'] = data['visibleName'];
			$scope.data['phone'] = data['phone'];
			

			
			async.series([
			
				//validate fields
				function(callback){$scope.validateForSignUp(callback,'woPass')},
			
				//get user from DB by ID, put to $scope.usersFromDb 
				function (callback){$scope.getUser(callback,req.USER['_id'])},
				
				//check whether email has been changed, if yes - check whether it is existed yet
				function(callback)
					{
					try
						{
						if (!$scope.usersFromDb.length) {callback((new Error ('Cannot find user in DB')));return false;}
						if ($scope.data['name']!=$scope.usersFromDb[0]['name'])
							async.series([$scope.getUser,$scope.checkUserExistance],callback);
						else
							callback();							
						}
					catch(err){err.message+='; Problems to start async series for checking whether this email is existed yet';callback(err);}
					},
				//update user
				function(callback)
					{
					db.collection('users').update({'_id':ObjectId(req.USER['_id'])},{'$set':$scope.data},callback);
					},
					
				],function(err,res)
					{
					try
						{
						if (err&&!err.userError) throw err;
						if (err&&err.userError) {callback(null,{'data':'',userError:true,'Error':err.Error});return false;}
						$scope.getUser(
							function(err,res)
								{
								$scope.sendToken('; Problems to get updated user and create new token!',err,res,callback);
								}
							,req.USER._id
							);
							
						}
					catch(err)
						{
						if (err) err.message+='; Problems to getUser from DB or check existance by new name';
						callback(err);
						return false;
						}
					})
				
			}
		catch(err)
			{
			err.message+='; Problems to update profile (send async requests or decode from base64)';
			callback(err);
			return false;
			}
		
			
		}
		
		
		
	function updatePassword(req,callback)
		{
		//make validation of password
		try
			{
				
			$scope.data = JSON.parse(decodeBase64(req.body.data));
			if (!$scope.data['new']||!$scope.data['confirm']||!$scope.data['current']) throw new userError('Некоторые поля отсутсвуют!');
			
			if ($scope.data['confirm']!=$scope.data['new']) throw new userError('Подтверждающий пароль не совпадает с новым!');
			
			//validate existed fields
			var m;
			for (var each in $scope.data)
				{	
				if ((m=$scope.data[each].isValidFor('password'))!=true) throw new userError(m);
				}
			
			async.series([
				function getUser(callback){$scope.getUser(callback,req.USER._id)},
				//check password current with DB
				function checkPassword(callback)
					{
					try
						{
						if (!$scope.usersFromDb.length) throw new Error('No user by id!');
						if ($scope.usersFromDb[0]['password']!=$scope.data['current']) throw new userError('Ваш действующий пароль (текущий) введен неверно!');
						callback();
						}
					catch(err) {callback(err);}
						
					},
				//UPDATE PASSWORD FOR USER
				function updateUserPass(callback){db.collection('users').update({'_id':ObjectId(req.USER._id)},{'$set':{'password':$scope.data.new}},callback);}
				],
			
				function(err,res){$scope.sendToken('Problems to update password for user',err,res,callback)})
				
			}
		catch(err)
			{
			if (err instanceof userError)
				{
				callback(null,{'data':'','Error':err.Error,'userError':true});
				return false;
				}
			err.message+='; Problems to start saving password!';
			callback(err);
			return false;
			}
		
		
		}
		
		
		
		
	function getAvatarFolder()
		{
		var slash = config['AVATAR_FOLDER'].substr(-1)=='/'?'':'/';
		return config['AVATAR_FOLDER']+slash;
		}
		
		
	//!!!Simply without "A"
	function encodeBase64(obj)
		{
		if (!obj) return obj;
		if (typeof obj=='object')
			obj = JSON.stringify(obj);

		if (typeof obj=='string')
			{
			var encoded = new Buffer(obj).toString('base64');
			return encoded;
			}	
		else
			return obj;

		}

	
	function encode(user)
		{
		return jwt.sign(user,config.SECRET,{'expiresIn':'24h'}); //expires in 24H
		}

	
	//only when signUp and login and updateProfile and pasword Update to retrieve original info
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