module.exports = function AdvertsModel($q,$rootScope, $filter,send_http)
    {

    //must be located in require
    var adverts = {};
	adverts.data = [];
    adverts['$get'] = $get; //get all adverts
    adverts['$createBlank'] = $createBlank; //create new sales object
	adverts['$push'] = $push; //push advert manually, only adding to array with transformation
	adverts['$unshift'] = $unshift; //push advert to start of array manually, only adding to array with transformation
	
	//prototype for blank
	var _proto_ = {};
	
	var _proto_ ={
		'isEmpty':isEmpty,
		'$getOnceCompleted':$getOnceCompleted,
		'$transform':$transform,
		'$setOnceCompleted':$setOnceCompleted,
		'$setFocused':$setFocused,
		'$restartOnceCompleted':$restartOnceCompleted,
		'$add':$add,
		'$update':$update,
		'$createMessage':$createMessage,
		'$close':$closeAdvert,
		'$completeWithMessages':$completeWithMessages  //get advert by id for user and complete Users and messages
		}
	
	for (var each in _proto_)
		{
		Object.defineProperty(_proto_,each,{enumerable:false})
		}
		

	var _proto_mess = {
		'$send':$sendMessage
		}
		
		
    function $get(params)
        {
		var url = params['withUsers']?'./api/adverts/get/private':'./api/adverts/get';
		url = params['filtring']&&params['filtring']['relatedToUser']?'./api/adverts/get/related':url;
		
			
        return send_http(url,'POST',params).then(function(response)
            {
            if (response.Error) return response;
			
			adverts.data = [];
			adverts.count = response.count;
            for (var each in response.data)
				{
				adverts.$push(response.data[each]);
				}
	
			return response;
            });
        }

	function $push(objNew)
		{
		var obj = Object.create(_proto_);
		$.extend(obj,objNew);
		obj.$transform();
		adverts.data.push(obj);
		}
	function $unshift(objNew)
		{
		var obj = Object.create(_proto_);
		$.extend(obj,objNew);
		obj.$transform();
		adverts.data.unshift(obj);
		}
		

	function $completeWithMessages()
		{
		var defer = $q.defer();
		
		//take parameter for history collection if we need take it from history
		if (this._id_old)
			params = {'filtring':{'history':true}};
		else
			params = {};
		
		//remove currently existed messages
		//because of previous requests - messages remains in advert object
		//but I should repul them to obtain more fresher
		if (this.Messages) delete this.Messages;
			
		
		send_http('./api/adverts/get/'+this._id,'POST',params).then(function(response)
			{
			if (!response.Error)
				{
				$.extend(this,response.data);
				this.$transform();
				}
				
			defer.resolve(response);
			}.bind(this))
			
		return defer.promise;
		
		}
		
		
	function $transform()
		{
		var advert = this;
		
		//transform data for history splitter (split group of adverts in history by date)
		advert['dateForHistorySplitter'] = $filter('date')(advert['Created'],'MMM yyyy');

		
		
		//not all adverts may contain users, because I have flag "withUsers"
		//to return adverts with users
		if (!advert.Users||!advert.Users.length)
			return false;
			
		var user,i;
		for (i=0;user=advert['Users'][i++];)
			{
			user.messages = advert.Messages[user['_id']].sort(function(a,b)
				{
				a = a['ts'];
				b = b['ts'];
				return a<b?-1:(a>b?1:0);
				});

			//get lastMessage
			loop1:
			for (var i_=user.messages.length;mess=user.messages[--i_];)
				{
				if (mess['from']!=advert['Owner'])
					{
					user['lastMessage'] = mess;
					if (isToday(mess['ts']))
						user['lastMessage']['dateStr'] = $filter('date')(mess['ts'],'HH:mm');
					else
						user['lastMessage']['dateStr'] = $filter('date')(mess['ts'],'d MMM');
					break loop1;
					}
				}
			
			
				
			user.messagesVisible = user.messagesVisible||false;
			
			
			}
			
		
		}
		
	function $update()
		{
		var defer = $q.defer();
		
		send_http('./api/adverts/update','POST',this).then(function(response)
			{
			defer.resolve(response);
			})
		return defer.promise;
		}
		
		
	function $closeAdvert()
		{
		var defer = $q.defer();
		send_http('./api/adverts/close','POST',this).then(function(response)
			{
			if (!response.Error)
				{
				//remove advert from adverts data
				loop1:
				for (var i=0;adv = adverts.data[i++];)
					{
					if (adv['_id']==this._id)
						{
						adverts.data.splice(i-1,1);
						break loop1;	
						}
					}
				
				}
			defer.resolve(response);
			}.bind(this))
		return defer.promise;
		
		}
		
		
    function $createBlank()
        {
        var tmp = Object.create(_proto_);
		
        tmp['Title'] = '';
        tmp['Price'] = '';
        tmp['Region'] = '';
		tmp['City'] = '';
		tmp['Street'] = '';
		tmp['Description'] = '';
		tmp['PriceUnit'] = '';
		tmp['IsPricePerUnit'] = false;
		tmp['RelatedUsers'] = [];
		tmp['Messages'] = {};
		tmp['Currency'] = ' грн';
		
        return tmp;
        }


	function $createMessage()
		{
		var mess = Object.create(_proto_mess);
		mess['advertId'] = this._id; //wil be removed from message object when update DB
		mess['from'] = $rootScope.USER['_id'];
		mess['to'] = '';
		mess['text'] = '';
		mess['ts'] = (new Date())*1; //timestamp, on backend will be changed
		
		mess.advert = this;
		
		return mess;
		}
		
 

	//to control that first row (title+price) has been completed at least one time
	//because if user has selected region, but remove price and title - expand class will be applied
	//and advert_form will be reduced
	var onceCompleted = false;
	
	//below variables necessary to control current focused state
	//because first expanding of banner (for optional fields) must be after blurring
	var isFocused = false;
		
		
		
		
	//PROTO PETHODS methods for one instances in array
    function $add()
        {
        return send_http('./api/adverts/create','POST',this).then(function(res)
            {
            if (res.Error)
				return res;

            adverts.data.push(res.data);
			return res;
            });
		return defer.promise;
        }
	
	
	
	function $sendMessage()
		{
		var mess = this;
		if (mess['from']==mess['advert']['Owner'])
			mess['owner'] = true;
		
		var advert = mess['advert'];
		delete mess['advert'];
		
		var defer = $q.defer();
		send_http('./api/adverts/messages/add','POST',mess).then(function(response)
			{
			if (!response.Error)
				{
				advert.Messages = advert.Messages||{};
				advert.RelatedUsers = advert.RelatedUsers||[];
				if ($rootScope.USER['_id']==advert['Owner'])
					{
					advert['Messages'][mess['to']] = advert['Messages'][mess['to']] || [];
					advert['Messages'][mess['to']].push(response.data);
					}
				else
					{
					advert['Messages'][mess['from']] = advert['Messages'][mess['from']] || [];
					advert['Messages'][mess['from']].push(response.data);
					advert.RelatedUsers.push($rootScope.USER['_id']);
					}
				advert.$transform();
				}
			defer.resolve(response);
			})
			
			
		return defer.promise;
			
		}
	
	
	function isEmpty()
		{
		if (this['Title']&&this['Price']&&(!this['IsPricePerUnit']||(this['IsPricePerUnit']&&this['PriceUnit'])))
			{
			if (!isFocused)
				{
				this.$setOnceCompleted();					
				}
			return false;
			}
		else
			return true;
		}

	function $setFocused(param)
		{
		isFocused = param;
		}
			
	function $getOnceCompleted()
		{
		return onceCompleted;
		}
			
	function $setOnceCompleted()
		{
		onceCompleted = true;
		}

	function $restartOnceCompleted()
		{
		onceCompleted = false;
		}
			
			
			
	function isToday(ts)
		{
		function toDay(ts){return parseInt(ts/(1000*60*60*24))}

		if (ts instanceof Date)
			ts = ts*1;
		
		var curDay = toDay((new Date())*1);
		var tsDay= toDay(ts);
		
		return curDay==tsDay;
		
		}
			
    return adverts;

    }
	
module.exports.$inject = ['$q','$rootScope','$filter','send_http']