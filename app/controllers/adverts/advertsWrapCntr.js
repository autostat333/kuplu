module.exports.$inject = ['$scope'];
module.exports = function advertsMainWrap($scope,$models)
	{	

		
	$scope.init = init;
	
	$scope.init();
		
		
	function init()
		{
		$scope.PARAMS = {};

			
		$scope.ADVERTS = $models('adverts');
		$scope.REGIONS = $models('regions');
		
		
		//$scope.ADVERTS.$get($scope.PARAMS);
		$scope.REGIONS.$get();
			
		}
		
		
		
		
		
	}