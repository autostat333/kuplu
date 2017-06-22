module.exports = function modelsFactory($q,$http)
    {

    var HOST = 'http://localhost:3008/';

    //internal method for SENDING HTTP REQUESTS
    function send_http(url,method,data)
        {
        var defer = $q.defer();

        url = HOST+url;
        $http({
            'method':method,
            'url':url,
            'data':data
        }).then(
            function(res)
            {
            defer.resolve(res.data);
            },
            function(err)
            {
            //HANDLE ERRORS from server
            defer.resolve('Error'); //simply answer error to run logic for error
            });

        return defer.promise;
        }



    return function(model_type)
        {
		if (model_type=='regions')
			return require('../models/regionsModel.js')($q,send_http);
		
		if (model_type=='adverts')
			return require('../models/advertsModel.js')($q,send_http);
		
        };

    }


module.exports.$inject = ['$q','$http'];