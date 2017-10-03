module.exports = function AdvertsCntr(config,db, userError,regions)
	{
	var async = require('async');
	
	
	$scope = {};
	
	$scope.getAll = getAll;
	$scope.createAdvert = createAdvert;
	
	$scope._checkObligatory = _checkObligatory;
	$scope._checkRules = _checkRules;
	$scope._checkGeo = _checkGeo;
	
	$scope._checkPagination = _checkPagination;
	$scope._checkFilterDate = _checkFilterDate;
	$scope._checkFilterRegion = _checkFilterRegion;
	$scope._checkFilterUserAdverts = _checkFilterUserAdverts;
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


	return $scope;
	
	
	function getAll(params,callback)
		{
			
		try
			{
			$scope._checkPagination(params);
			
			$scope._checkFilterDate(params);
			$scope._checkFilterRegion(params);
			$scope._checkFilterUserAdverts(params);
			
			$scope._checkSorting(params);
				
				
			var find = $scope._transformFiltringParams(params);
				
			var cursor = db.collection('adverts').find(find)
			
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
					if (stop) return false; //to prevent twoi times call callback
					if (!doc)
						{
						callback(null,data);
						stop = true;
						return false;
						}
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
	
	function _transformFiltringParams(params)
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
			find['Owner'] = params['userId'];
			}
			
		//because error from mongoDB when ampty '$and'
		if ($scope._isEmptyProperties(find['$and']))
			delete find['$and'];
			
		return find;
	
		}
	
	
	
	
	function createAdvert(doc,callback)
		{
		try
			{
			//check existance of obligation fields
			//if error - it will be catched by catch and sended to front
			$scope.advert = doc;
			$scope._checkObligatory();
			$scope._checkRules();
			$scope._checkGeo();
			
			
			//!!!TODO CHEKC ALLOWED FIELDS
			//!!!ADD USERS FOR FILTRING
			
			//convert to Int Price
			$scope.advert['Price']*=1;
			$scope.advert['Created'] = new Date();
			$scope.advert['CreatedDay'] = $scope.advert['Created'].toISOString().substr(0,10);
			$scope.advert['CreatedTimeStamp'] = $scope.advert['Created'].getTime()+'';
			
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
	
	
	
	