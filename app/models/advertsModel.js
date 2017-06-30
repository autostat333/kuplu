module.exports = function AdvertsModel($q,send_http)
    {

    //must be located in require
    var adverts = {};
	adverts.data = [];
    adverts['$get'] = $get;
    adverts['$add'] = $add;
    adverts['$create_blank'] = $create_blank; //create new sales object



    function $get()
        {
        return send_http('./api/adverts/get','POST',{}).then(function(res)
            {
            if (res==='Error')
                {
                alert('Something happens when obtain all sales!')
                return false;
                }
            for (var each in res)
                {
                adverts.data.push(res[each]);
                }
            });
        }



    function $add(doc)
        {
        var defer = $q.defer();

        (doc.clear_int_methods||noop).apply(doc);

        return send_http('./api/sales/add','POST',doc).then(function(res)
            {
            if (res=='Error')
                {
                alert('Something happens when save new Sale!');
                return false;
                }
            adverts.data.push(res);
            });
        }


    function $create_blank()
        {
        var tmp  = new _aux_methods;
        tmp['Title'] = '';
        tmp['Price'] = '';
        tmp['Region'] = '';
		tmp['City'] = '';
		tmp['Street'] = '';
		tmp['Description'] = '';

		
        return tmp;
        }



	//methods for one instances in array
    function _aux_methods()
        {
		//private variables
		
		
		//to control that first row (title+price) has been completed at least one time
		//because if user has selected region, but remove price and title - expand class will be applied
		//and advert_form will be reduced
		var once_completed = false;

		
		this.isEmpty = function()
			{
			if (this['Title']&&this['Price'])
				{
				this.setOnceCompleted();
				return false;
				}
			else
				return true;

			}


		this.getOnceCompleted = function()
			{
			return once_completed;
			}
		this.setOnceCompleted = function()
			{
			once_completed = true;
			}
			
			
		//slear all methods for 
        this.clear_int_methods = function()
            {			
            for (var each in cache_int_methods)
                {
                delete this[cache_int_methods[each]];
                }
				
            }

        //for saving internal methods for removing them from object when save
        var cache_int_methods = Object.keys(this);

        }

    return adverts;

    }