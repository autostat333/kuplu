module.exports = function SalesModel($q,send_http)
    {

    //must be located in require
    var regions = {};
	regions.data = [];
	regions.$get = _get;
	

    function _get()
        {
        return send_http('./api/regions/get','GET').then(function(res)
            {
            if (res==='Error')
                {
                alert('Something happens when obtain all sales!')
                return false;
                }
            for (var each in res)
                {
                regions.data.push(res[each]);
                }
            });
        }


    return regions;

    }