module.exports = function ProfileUserInfoCntr($scope,$account,$rootScope)
	{
	
	$scope.init = init;
	
	$scope.init();
	
	function init()
		{
		
		$scope.account = $account.createBlankSignUp();
		for (var each in $rootScope.USER)
			{
			$scope.account[each] = $rootScope.USER[each];
			}
			
		}
		
		
		
	}
	
module.exports.$inject = ['$scope','$account','$rootScope'];