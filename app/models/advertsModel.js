module.exports = function AdvertsModel($q,send_http)
    {

    //must be located in require
    var adverts = {};
	adverts.data = [];
    adverts['$get'] = $get; //get all adverts
    adverts['$createBlank'] = $createBlank; //create new sales object

	
	//prototype for blank
	var _proto_ = {
		'isEmpty':isEmpty,
		'$getOnceCompleted':$getOnceCompleted,
		'$setOnceCompleted':$setOnceCompleted,
		'$setFocused':$setFocused,
		'$restartOnceCompleted':$restartOnceCompleted,
		'$add':$add
		
		}


    function $get(params)
        {
        return send_http('./api/adverts/get','POST',params).then(function(response)
            {
            if (response.Error) return response;
			
			adverts.data = [];
			adverts.count = response.count;
            for (var each in response.data)
				{
				var obj = Object.create(_proto_);
				$.extend(obj,response.data[each]);
                adverts.data.push(obj);
				}
	
			return response;
            });
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
		tmp['Currency'] = ' грн';
		
        return tmp;
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
			
    return adverts;

    }