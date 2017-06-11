module.exports = function SalesModel($q,$http,send_http)
    {

    //must be located in require
    var sales = {};
    sales.data = [];
    sales['$get'] = sales_get;
    sales['$add'] = sales_add;
    sales['$create_blank'] = sales_create_blank; //create new sales object


    function sales_get()
        {
        return send_http('./api/sales/get','GET').then(function(res)
            {
            if (res==='Error')
                {
                alert('Something happens when obtain all sales!')
                return false;
                }
            for (var each in res)
                {

                sales.data.push(res[each]);
                }
            });
        }



    function sales_add(doc)
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
            sales.data.push(res);
            });
        }


    function sales_create_blank()
        {
        var tmp  = new _aux_methods;
        tmp['name'] = '';
        tmp['qty'] = '';
        tmp['price'] = '';

        return tmp;
        }



    function _aux_methods()
        {
        //check whether sales is Empty
        this.isEmpty = function()
            {
            for (var each in this)
                {
                if (typeof this[each]!='function')
                    {
                    if (this[each])
                        return false;
                    }
                }
            return true;
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

    return sales;

    }