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

        this.isEmpty = function()
            {
            for (var each in this)
                {
                if (typeof this[each]!='function')
                    {
                    if (!this[each])
                        return true;
                    }
                }
            return false;
            }






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