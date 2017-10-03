module.exports = function AdvertsModel($q,send_http)
    {

    //must be located in require
    var adverts = {};
	adverts.data = [];
    adverts['$get'] = $get; //get all adverts
    adverts['$createBlank'] = $createBlank; //create new sales object



    function $get()
        {
        return send_http('./api/adverts/get','POST',{}).then(function(res)
            {
            if (res.Error) return res;
			
			adverts.data = [];		
            for (var each in res.data)
                adverts.data.push(res.data[each]);
	
			return adverts.data;
            });
        }



    function $createBlank()
        {
        var tmp  = new _item_proto;
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



    function $add(doc)
        {
        var defer = $q.defer();

        clearIntMethods(doc);

        return send_http('./api/sales/add','POST',doc).then(function(res)
            {
            if (res.Error)
                {
                alert('Something happens when save new Sale!');
                return false;
                }
            adverts.data.push(res);
            });
        }


	//methods for one instances in array
    function _item_proto()
        {
	
		
		//to control that first row (title+price) has been completed at least one time
		//because if user has selected region, but remove price and title - expand class will be applied
		//and advert_form will be reduced
		var onceCompleted = false;
		
		//below variables necessary to control current focused state
		//because first expanding of banner (for optional fields) must be after blurring
		var isFocused = false;

		
		this.isEmpty = function()
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
 
		this.$setFocused = function(param)
			{
			isFocused = param;
			}
			
		this.$getOnceCompleted = function()
			{
			return onceCompleted;
			}
			
		this.$setOnceCompleted = function()
			{
			onceCompleted = true;
			}
			

        }

		
		
		function clearIntMethods(doc)
			{
			if (typeof doc!='object') return false;
			
			for (var each in doc)
				{
				if (each.indexOf('$')==0)
					delete doc[each];
				}
				
			}
		
		
		
		
    return adverts;

    }