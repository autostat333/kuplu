
module.exports = function(async)  //do not forget add dependency to server.js
    {
    
 
    var $scope = {};
	$scope.get_regions = get_regions;
 


    return $scope;


	
	function get_regions(callback)
		{
		callback(null,['Kiev','Lvov','Odessa']);
		}
	

    };

