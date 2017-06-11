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
            console.log(err.data);
            defer.resolve('Error'); //simply answer error to run logic for error
            });

        return defer.promise;
        }


    var args = Array.prototype.slice.call(arguments);
    args.push(send_http);

    return function(model_type)
        {
        var url = '../models/salesModel.js';
        return require('../models/salesModel.js').apply(null,args);
        };

    }


module.exports.$inject = ['$q','$http'];