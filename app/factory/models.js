module.exports = function modelsFactory($q,$http,$mdDialog,$rootScope,$filter)
    {

    var HOST = 'http://localhost:3008/';

	
	function handleError(errMess)
		{
			
		//here possible send request
		return $mdDialog.show($mdDialog
			.alert()
			.title('Упс,')
			.textContent(errMess)
			.ok('Закрыть')
			.multiple(true)
			)
		}
	
	
    //internal method for SENDING HTTP REQUESTS
    function send_http(url,method,data,errMess)
        {
        var defer = $q.defer();

        url = HOST+url;
        $http({
            'method':method,
            'url':url,
            'data':data
        }).then(
            function(response)
            {
			response = response.data;
			if (response.Error&&!response.userError)
				{
				handleError(response.Error).then(function()
					{
					defer.resolve(response);
					})
				}
			defer.resolve(response);
            },
            function(err)
            {
			var msgText = errMess||err.message||'Возникла проблема получения ответа от сервера по урлу:'+url;
			handleError(msgText).then(function()
				{
				defer.resolve({'Error':msgText}); //simply answer error to run logic for error
				})
            });

        return defer.promise;
        }



    return function(model_type)
        {
		switch(model_type)
			{
			case 'regions':
				return require('../models/regionsModel.js')($q,$rootScope,send_http);
			case 'adverts':
				return require('../models/advertsModel.js')($q,$rootScope,$filter,send_http);
			case 'categories':
				return require('../models/regionsModel.js')($q,$rootScope, send_http);
			}
			
		
        };

    }
	
module.exports.$inject = ['$q','$http','$mdDialog','$rootScope','$filter'];


