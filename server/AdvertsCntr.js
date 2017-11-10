module.exports = function AdvertsCntr(config,db, userError,regions)
	{
	var async = require('async');
	var ObjectId = require('mongodb').ObjectId;
	var _ = require('lodash');
	
	$scope = {};
	
	$scope.getAll = getAll;
	$scope.getAllRelatedToUser = getAllRelatedToUser;
	$scope.getAllWithUsers = getAllWithUsers;
	$scope.getAdvertById = getAdvertById;
	


	$scope.createAdvert = createAdvert;
	$scope.updateAdvert = updateAdvert;
	$scope.closeAdvert = closeAdvert;
	$scope.addMessage = addMessage;

	
	$scope.transformAdvert = transformAdvert;
	
	$scope._checkObligatory = _checkObligatory;
	$scope._checkRules = _checkRules;
	$scope._checkGeo = _checkGeo;
	
	$scope._checkPagination = _checkPagination;
	$scope._checkFilterDate = _checkFilterDate;
	$scope._checkFilterRegion = _checkFilterRegion;
	$scope._checkFilterUserAdverts = _checkFilterUserAdverts;
	$scope._checkFilterRelatedUserAdverts = _checkFilterRelatedUserAdverts;
	$scope._checkSorting = _checkSorting;
	$scope._checkAllowedFields = _checkAllowedFields;
	
	
	$scope._isNotDefined = _isNotDefined;
	$scope._isEmptyProperties = _isEmptyProperties;
	$scope._transformFiltringParams = _transformFiltringParams;
	
	
	var model = {
		'_id':{},
		'Title':{},
		'Price':{},
		'Region':{},
		'City':{},
		'Street':{},
		'Description':{},
		'PriceUnit':{},
		'Currency':{},
		'IsPricePerUnit':{},
		'Created':{},
		'CreatedDay':{},
		'CreatedTimeStamp':{},
		'UserId':{}
		};

		
		
	//it is params for projection, to prevent sending in user object passwords and phones
	//takes part in two methods - getAllWithUsers & getById

	var excludeFieldsFromUser = {};
	excludeFieldsFromUser['password'] = 0;
	excludeFieldsFromUser['phone'] = 0;
	excludeFieldsFromUser['created'] = 0;
	excludeFieldsFromUser['name'] = 0;
		
		

	return $scope;
	
	
	function getAll(params,USER,callback)
		{
			
		try
			{
			$scope._checkPagination(params);
			
			$scope._checkFilterDate(params);
			$scope._checkFilterRegion(params);
			$scope._checkFilterUserAdverts(params);
			$scope._checkFilterRelatedUserAdverts(params);
			
			$scope._checkSorting(params);
				

			var find = $scope._transformFiltringParams(params,USER);
				
				
			//if request to DB from history
			if (params&&params['filtring']['history'])
				var cursor = db.collection('advertsHistory').find(find,{'Messages':0,'RelatedUsers':0});
			else
				var cursor = db.collection('adverts').find(find);
			
			
			
			if (params['sorting'])
				cursor = cursor.sort(params['sorting']);
			else
				cursor = cursor.sort({'Created':-1});

			var data = {'data':[],'Error':''};
			var stop = false;
			cursor.count(function(err,count)
				{
				if (err){callback(err);return false;}
				
				if (params['pagination'])
					cursor = cursor.skip(params['pagination']['skip']).limit(params['pagination']['limit']);
				data['count'] = count;
				cursor.each(function(err,doc)
					{
					if (stop) return false; //to prevent two times call callback
					if (!doc)
						{
						callback(null,data);
						stop = true;
						return false;
						}
						
					doc = $scope.transformAdvert(doc,USER) //remove all messages which are not allow for user
					data['data'].push(doc);					
					})
				})
			}
		catch(err)
			{
			if (err.userError)
				{
				callback(null,err);
				return false;
				}
			err.message+="; Error when start db request for all adverts!";
			callback(err);return false;
			}
		
		}
	
	
	//this method gets all adverts and complete it with users (relatedUsersList)
	//but finally it remains only all users if user is owner
	function getAllWithUsers(params,req,callback)
		{
			
			
		$scope.getAll(params,req.USER,function(err,res)
			{
			if (err instanceof userError)
				{
				callback(null,{'data':'','Error':err.Error,'userError':true});
				return false;
				}
			if (err){callback(err);return false;}
				
			//complete users
			async.each(res['data'],function(advert,callback)
				{
				if (!advert['RelatedUsers']||!(advert['RelatedUsers'] instanceof Array))
					{
					callback();
					return false;
					}
				
				var ids = advert['RelatedUsers'].map(function(_id){return ObjectId(_id)});
				db.collection('users').find({'_id':{'$in':ids}},excludeFieldsFromUser).toArray(function(err,docs)
					{
					if (err){err.message+='; Cannot get users for RelatedUsers';callback(err);return false}
					advert.Users = docs;
					callback();
					})
				},function(err,res_)
					{
					try
						{
						if (err) throw err;
						callback(null,res);
						}
					catch(err)
						{
						err.message+='; Problems to execute getAllAdverts with users!';
						callback(err);
						return false;
						}
					})
				
				
			})
		}
	
	
	
	//it will get all transformed adverts (removed all not permitted messages and RelatedUser object)
	//also it adds owner object
	function getAllRelatedToUser(params,USER,callback)
		{
		params['filtring'] = params['filtring']||{'filtring':{}};
		params['filtring']['relatedToUser'] = true;
		$scope.getAll(params,USER,function(err,response)
			{
			if (err) {err.messages+='; Problems to obtain adverts related to user!';calback(err);return false};
			async.each(response.data,function handleUser(advert,callback)
				{
				db.collection('users').findOne({'_id':ObjectId(advert['Owner'])},excludeFieldsFromUser,function pushOwner(err,doc)
					{
					if (err){err.message+='; Error when push user to array';callback(err);return false;}
					advert['OwnerObj'] = doc;
					callback();
					})
				},function finishGettingOwner(err,res)
					{
					if (err) {err.message+='; Error when get all adverts related to user!';callback(err);return false}
					callback(null,response);
					})
			})
					
		}
	
	
	
	//by default returns with users
	function getAdvertById(req,callback)
		{
		var _id = req.params['id'];
		
		async.series([
			function getAdvert(callback)
				{
				if (req.body['filtring']&&req.body['filtring']['history'])
					var collection = 'advertsHistory';
				else
					var collection = 'adverts';
				
				db.collection(collection).findOne({'_id':ObjectId(_id)},function(err,doc)
					{
					if (err) {err.message+='; Cannot get advert by Id from collection'; callback(err);return false};
					$scope.advert = doc||{};
					$scope.advert['Users'] = [];
					callback();
					});
				},
			function getUsersForAdvert(callback)
				{
				async.each($scope.advert['RelatedUsers'],function(_id,callback_)
					{
					db.collection('users').findOne({'_id':ObjectId(_id)},excludeFieldsFromUser,function(err,user)
						{
						if (err){err.message+='; Problem to obtain user when get advert by id!';callback_(err);return false;}
						$scope.advert['Users'].push(user);
						callback_();
						})
					},callback)
				}
			],function(err,res)
				{
				try
					{
					if (err) throw err;
					$scope.advert = $scope.transformAdvert($scope.advert,req.USER);
					callback(null,{'data':$scope.advert,'Error':''});
					}
				catch(err)
					{
					err.message+='; Some problems when execute asyncseries to get advert by ID';
					callback(err);
					return false;
					}
				})
			
			
		}
	
	
	function addMessage(req,callback)
		{
		try
			{
			var message = req.body,m;
			if ((m=message.text.isValidFor('advert/message'))!=true) throw new userError(m);
			message['ts'] = (new Date())*1;
			async.series([
					function getUser(callback)
						{
						db.collection('users').find(
							{
							'$or':[{'_id':ObjectId(message.from)},
									{'_id':ObjectId(message.to)}]
							})
							.count(function(err,count)
								{
								if (err) {callback(err);return false}
								if (count!=2)
									{
									var err = new userError('Отсутсвует или пользоветель которму адрессовано сообщение или автор сообщения!');
									callback(err);
									return false;
									}
								callback();
								})
						},
					function saveMessage(callback)
						{
						var update = {};
						
						//if not owner
						if (!message['owner'])
							{
							update['$addToSet'] = {};
							update['$addToSet']['RelatedUsers'] = message.from;
							update['$push'] = {};
							var field = 'Messages'+'.'+message.from;
							update['$push'][field] = message;
							}
						else
							{
							update['$push'] = {};
							var field = 'Messages'+'.'+message.to;
							update['$push'][field] = message;
							}
						
						delete message['owner'];
						
						db.collection('adverts').update({'_id':ObjectId(message.advertId)},update,function(err,res)
							{
							if (res) $scope.message = message;
							callback(err,res);
							})

						}
				],function(err,res)
					{
					if (err instanceof userError)
						{
						callback(null,{'data':'','Error':err.Error,'userError':true});
						return false;
						}
					if (err){err.message+='; Problems when update messages in DB or get user';callback(err);return false;}
					callback(null,{'data':$scope.message,'Error':''});
					})
			}
		catch(err)
			{
			if (err instanceof userError)
				{
				callback(null,{'data':'','Error':err.Error,'userError':true});
				return false;
				}
				
			err.message+='; Problems to start adding message!';
			callback(err);
			return false;
			}
			
		
		}
	
	
	function closeAdvert(advert,user,callback)
		{
		try
			{
			if (user['_id']!=advert['Owner']) throw new userError('Вы не можете закрыть не свое намерение!');
			
			async.series([
				function findOne(callback){db.collection('adverts').findOne({'_id':ObjectId(advert._id)},function(err,doc)
					{
					if (err) {err.message+='; Problems to get doc from DB for remjoving to advertsHistory collection';callback(err);return false}
					$scope.advert = doc;
					callback();
					})},
				function removeFromDb(callback){db.collection('adverts').remove({'_id':ObjectId($scope.advert['_id'])},callback)},
				function insertToHistory(callback)
					{
					$scope.advert['_id_old'] = $scope.advert['_id'];
					delete $scope.advert['_id']
					db.collection('advertsHistory').insert($scope.advert,callback)
					}
				],function(err,res)
					{
					if (err) {err.message+='; Problems to remove or insert advert from DB!';callback(err);return false;}
					callback(null,{'data':$scope.advert,'Error':''});
					})
				
			}
			
		catch(err)
			{
			if (err instanceof userError)
				{
				callback(null,{'data':'',Error:err.Error,'userError':true});
				return false;
				}
				
			if (err){err.message+='; Problems to remove advert to history collection!';callback(err);return false}
			
			callback(null,{'data':advert,'Error':''});
			return false;
			}
			
			
		}
	
	
	
	function _checkPagination(params)
		{
		var mess;
		
		if ($scope._isNotDefined(params)||_isEmptyProperties(params['pagination']))
			{
			params['pagination']?(delete params['pagination']):'';
			return false;
			};
		
		if ((mess = params['pagination']['skip'].isValidFor('numbers'))!=true
			||(mess = params['pagination']['limit'].isValidFor('numbers'))!=true
			) throw new userError(mess);
			
		}
	
	
	function _checkFilterDate(params)
		{
		if (!params||!params['filtring']||$scope._isEmptyProperties(params['filtring']['date'])) return false;
			
		var mess;
		
		//check for DATE filter
		//if date not existed 
		
		if (params['filtring']['date']['from']&&(mess = params['filtring']['date']['from'].isValidFor('advert/date'))!=true)
			throw new userError(mess);

		if (params['filtring']['date']['to']&&(mess = params['filtring']['date']['to'].isValidFor('advert/date'))!=true)
			throw new userError(mess);

			
		}
	
	
	
	function _checkFilterRegion(params)
		{
			
		var mess;	
		if (!params||!params['filtring']||!params['filtring']['region']) return false;
		
			
		//check for REGION filter
		if ((mess = params['filtring']['region'].isValidFor('objectId'))!=true) throw new userError(mess);

		}
	

	function _checkFilterUserAdverts(params)
		{
		if (!params||!params['filtring']||!params['filtring']['onlyUserAdverts']) return false;

		//check for users adverts filter
		if (typeof params['filtring']['onlyUserAdverts'] !='boolean') throw new userError("Неверный формат для фильтрации данных по намерениям пользователя (ожидаем булеан)");
		
		}

	function _checkFilterRelatedUserAdverts(params)
		{
		if (!params['filtring']||(params['filtring']&&!params['relatedToUser'])) return false;
		
		if (typeof params['filtring']['relatedToUser']!='boolean') throw new userError('Неверный формат флага для поля relatedToUser, должен быть булеан!');
		}
	
	
	function _checkSorting(params)
		{
		if (!params||$scope._isEmptyProperties(params['sorting'])) 
			{
			params['sorting']?(delete params['sorting']):'';
			return false;	
			}
			
		
		
		if (typeof params['sorting'] =='object')
			{
			for (var each in params['sorting'])
				{
				if (!model[each]
					&&params['sorting'][each].isValidFor('numbers')!=true
					) throw new userError('Сортировка по данному полю не допустима!');
					
				}
			}
		else
			throw new userError('Неверный формат для сортировки!');
			
		}
	
	function _transformFiltringParams(params,USER)
		{
		var find = {};

		if (_isEmptyProperties(params)) return find;
	

		//transform date filtring
		if (params['filtring']['date'])
			{
			find['$and'] = [];
			var from_ = new Date(params['filtring']['date']['from']);
			var to_ = new Date(params['filtring']['date']['to']);
			if (from_&&from_!='Invalid Date') find['$and'].push({'Created':{'$gt':from_}});
			if (to_&&to_!='Invalid Date') find['$and'].push({'Created':{'$lt':to_}});
			}
			
			
		//transform region filter
		if (params['filtring']['region'])
			{
			find['Region._id'] = params['filtring']['region'];
			}
		delete params['filtring']['region'];
			
			
		//transform onlyUserAdverts
		if (params['filtring']['onlyUserAdverts'])
			{
			find['Owner'] = USER['_id'];
			}
			
			
		//transform relatedToUser flag
		if (params['filtring']['relatedToUser'])
			{
			find['RelatedUsers'] = USER._id;
			}
			
		//because error from mongoDB when ampty '$and'
		if ($scope._isEmptyProperties(find['$and']))
			delete find['$and'];
			
		return find;
	
		}
	
	function transformAdvert(advert,USER)
		{
		if (!USER)
			{
			delete advert['Messages'];
			delete advert['RelatedUsers'];
			delete advert['Users']; //it is not remains in DB but can be added from completeUsers
			
			return advert;
			}
			
		//if auth user but he is not owner - return only his messages
		if (USER._id!=advert['Owner']&&advert['Messages'])
			{
			var mes = advert['Messages'][USER._id];
			advert['Messages'] = {};
			advert['RelatedUsers'] = [];
			//i include owner object to list of users
			if (advert['Users']) advert['Users'] = advert['Users'].filter(function(el){return el['_id']==USER['_id']||el['_id']==advert['Owner']}); 
			
		
			if (mes)
				{
				advert['Messages'][USER._id] = mes;
				advert['RelatedUsers'] = [USER._id];					
				}
			
			return advert
			}
		return advert; //for owner
			
		}
	
	
	
	function createAdvert(doc,USER,callback)
		{
		try
			{
			//check existance of obligation fields
			//if error - it will be catched by catch and sended to front
			$scope.advert = doc;
			$scope._checkObligatory();
			$scope._checkRules();
			$scope._checkGeo();
			
			if (!USER) throw new Error('Отсутствует пользователь в токене или токен не корректный!');
			
			//!!!TODO CHEKC ALLOWED FIELDS
			//!!!ADD USERS FOR FILTRING
			
			//convert to Int Price
			$scope.advert['Price']*=1;
			$scope.advert['Created'] = new Date();
			$scope.advert['CreatedDay'] = $scope.advert['Created'].toISOString().substr(0,10);
			$scope.advert['CreatedTimeStamp'] = $scope.advert['Created'].getTime()+'';
			$scope.advert['Owner'] = USER['_id'];
			
			
			db.collection('adverts').insert($scope.advert,function(err,doc)
				{
				try
					{
					if (err) throw err;
					callback(null,{'data':doc['ops'][0],'Error':''});
					}
				catch(err)
					{
					err.message+="Some error when update advert when creating new one or update";
					callback(err);
					return false;
					}
					
				})
			
			}	

		catch(err)
			{
			//check whether iut is object userError
			if (err.userError)
				{
				callback(null,err)
				return false;
				}
				
			err.message+="; Problem when passing validation or starting requests!";
			callback(err);
			return false;
			}
			
		}


	
	function updateAdvert(doc,USER,callback)
		{
		try
			{
			//check existance of obligation fields
			//if error - it will be catched by catch and sended to front
			
			
			$scope.advert = _.pick(doc,[
						'Title',
						'Description',
						'Price',
						'PriceUnit',
						'Street',
						'Currency',
						'IsPricePerUnit',
						'Region',
						'City'])
						
			
			$scope._checkObligatory();
			$scope._checkRules();
			$scope._checkGeo();
			
			if (!USER) throw new Error('Отсутствует пользователь в токене или токен не корректный!');
			
			//!!!TODO CHEKC ALLOWED FIELDS
			//!!!ADD USERS FOR FILTRING
			
		
			//convert to Int Price
			$scope.advert['Price']*=1;
			var updateDate = new Date();

			
			
			db.collection('adverts').update({'_id':ObjectId(doc._id)},{'$set':$scope.advert,'$push':{'Updated':updateDate}},function(err,doc)
				{
				try
					{
					if (err) throw err;
					callback(null,{'data':'','Error':''});
					}
				catch(err)
					{
					err.message+="Some error when update advert";
					callback(err);
					return false;
					}
					
				})
			
			}	

		catch(err)
			{
			//check whether iut is object userError
			if (err.userError)
				{
				callback(null,err)
				return false;
				}
				
			err.message+="; Problem when passing validation or starting requests!";
			callback(err);
			return false;
			}
			
		}








		
	
	function _checkObligatory()
		{
		if (!$scope.advert['Title']||
			!$scope.advert['Price']||
			!$scope.advert['Currency'])
			throw new userError('Отсутствуют обязательные поля для намерения (заголовок, цена, вид валюты)!');
			
		}
		
		
	function _checkRules()
		{
		var msg;
		if ((msg = $scope.advert['Title'].isValidFor('advert/Title'))!=true) throw new userError(msg);
		if ((msg = $scope.advert['Price'].isValidFor('advert/Price'))!=true) throw new userError(msg);
		if ((msg=$scope.advert['Currency'].isValidFor('advert/Currency'))!=true) throw new userError(msg);
		if ((msg=$scope.advert['Description'].isValidFor('advert/Description'))!=true) throw new userError(msg);
		if ((msg=$scope.advert['Street'].isValidFor('advert/Street'))!=true) throw new userError(msg);
		}

	function _checkGeo()
		{
		var errMessRegion = "Данный регион отсутствует в базе данных!";
		var errMessCity = "Данный город отсутствует в базе данных!";	
		
		if ($scope.advert['Region']&&typeof $scope.advert['Region']!='object')
			throw new userError(errMessRegion);
		
		if ($scope.advert['City']&&typeof $scope.advert['City']!='object')
			throw new userError(errMessCity);
		
		
		//check whether city is existed and region is not
		if (!$scope.advert['Region']&&$scope.advert['City']) throw new userError('Для данного города не задан регион!');
		
		//check region
		if ($scope.advert['Region'])
			{
			var region = regions.data.filter(function(el){return el['_id']==$scope.advert['Region']['_id']});
			if (!region.length) throw new userError(errMessRegion);
			}
		
		if ($scope.advert['City'])
			{
			//var region = regions.data.filter(function(el){return el['_id']==$scope.advert['Region']['_id']});
			var city = region[0]['cities'].filter(function(el){return el['name']==$scope.advert['City']['name']});
			if (!city.length) throw new userError(errMessCity);
			}
		
		}
		
	function _checkAllowedFields(obj)
		{
		var errMess = "В документе присутствуют поля не допустимые для сохранения или выборки!";
		for (var each in obj)
			{
			if (!model[each])
				throw new userError(errMess);
			}
		}

		
		
	function _isNotDefined(obj)
		{
		if (obj===0) return false;
		if (!obj) return true;
		if (typeof obj=='object'&&!Object.keys(obj).length&&!(obj instanceof Date)) return true;
		
		return false;
		
		}
		
	function _isEmptyProperties(obj)
		{
		if ($scope._isNotDefined(obj)) return true;
		if (typeof obj !='object'||obj===0||(obj instanceof Date)) return false; //for strings and numbers (if it is not object and if it passed isNotDefined - means value is defined)
		
		for (var each in obj)
			{
			if (typeof obj[each]!='object'&&obj[each])
				return false
			
			if (typeof obj[each]=='object')
				if (!_isEmptyProperties(obj[each])) return false;
			}
			
		return true;
		
		}
		
	
	}
	
	
	
	