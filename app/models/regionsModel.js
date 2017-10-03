module.exports = function SalesModel($q,send_http)
    {

    //must be located in require
    var regions = {};
	regions.data = [];
	regions.$get = _get;
	

    function _get()
        {
        return send_http('./api/regions/get','GET').then(function(response)
            {
			if (response.Error)
				{
				return response;
				}
				
			regions.data = [];
            for (var each in response.data)
                regions.data.push(response.data[each]);
	
			regions.data.sort(sortPattern)
				
			for (var i=0;el = regions[i++];)
				{
				el.cities.sort(sortPattern);
				}
	
			return response;
            });
			
			
        }

		
	function sortPattern(a,b)
		{
		a = a['name'];
		b = b['name'];
		return a<b?-1:(a>b?1:0);
		}
		

    return regions;

    }