//MAIN controller
//responsible for:
//  - determining current day (CURRENT_DAY gloabal object)
//    it is also runs callback every minute for refresh current time
//  - all handlers for clicking on toolbar
//

module.exports = function Controllers($scope,$mdMenu,$filter,$timeout)
	{


	$scope.open_dropdown = open_dropdown; //for login
	$scope.minimize = minimize;
	$scope.fullscreen_switch = fullscreen_switch;
	$scope.close = close;
	$scope.cur_dt = cur_dt;
	$scope.init = init;


	$scope.$on('$destroy',$scope.destroy_callback);


	$scope.init();


	function init()
		{
		///determine current DATE obj and run every minute refreshing
		$scope.CURRENT_DATE = {};
		$scope.cur_dt();

		$scope.fullscreen = false;

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


	function minimize()
		{
		ipcRenderer.send('minimize');
		}


	function fullscreen_switch(param)
		{
		ipcRenderer.send(param?'fullscreen_in':'fullscreen_out');
		$scope.fullscreen = param;
		}



	function close()
		{
		ipcRenderer.send('close');
		}




	}


module.exports.$inject = ['$scope','$mdMenu','$filter','$timeout'];