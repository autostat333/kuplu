module.exports = function MainCntr($scope,$filter,$timeout,$models,$mdDialog,$templateCache,$account,$state)
	{

	$scope.open_dropdown = open_dropdown; //for login
	$scope.cur_dt = cur_dt;
	$scope.init = init;
	$scope.logout = logout;
	$scope.login = login;
	$scope.goToProfile = goToProfile;


	$scope.$on('$destroy',$scope.destroy_callback);

	

	$scope.init();


	function init()
		{
		///determine current DATE obj and run every minute refreshing
		$scope.CURRENT_DATE = {};
		$scope.cur_dt(); //set current date
		
		
		}

		
		
	function destroy_callback()
		{
		$timeout.cancel($scope.dater_callback);
		}




	function cur_dt()
		{
		var dt = new Date();
		$scope.CURRENT_DATE.date = dt;

		var parsed = $filter('date')(dt,'yyyy-MM-dd`H:mm`EEE`d, MMM').split('`');

		$scope.CURRENT_DATE.date_str = parsed[0];
		$scope.CURRENT_DATE.time_str = parsed[1];
		$scope.CURRENT_DATE.week_day_str = parsed[2];
		$scope.CURRENT_DATE.day_str = parsed[3];
		$scope.dater_callback = $timeout($scope.cur_dt,1000*30);
		}



	function open_dropdown(mdMenu,e)
		{
		mdMenu.open(e);
		}

	function goToProfile()
		{
		$state.go('main.profile.userInfo');
		}
	
	
	
	function login()
		{
		return $mdDialog.show({
			templateUrl:'./views/loginModal/loginModal.html',
			controller:'loginCntr',
			clickOutsideToClose:true,
			escapeToClose:true
			
			})
		
		}
	
	
	function logout()
		{
		$account.logout();
		}
	
	
	}


module.exports.$inject = ['$scope','$filter','$timeout','$models','$mdDialog','$templateCache','$account','$state'];