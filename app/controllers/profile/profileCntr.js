module.exports = function ProfileCntr($scope,$state)
	{
	
	$scope.init = init;
	$scope.checkState = checkState;
	
	$scope.init();
	
	function init()
		{
		$scope.currentNavItem = 'userInfo';
		
			
		}
		
		
	function checkState(st)
		{
		return $state.current.name==st;
			
		}
		
		
	}
	
module.exports.$inject = ['$scope','$state'];