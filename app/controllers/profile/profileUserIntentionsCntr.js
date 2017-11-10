module.exports = function ProfileUserInfoCntr($scope,$timeout,$models,$rootScope,$mdDialog,$q)
	{
	
	$scope.init = init;
	
		
	$scope.getAllPrivateAdverts = getAllPrivateAdverts;
	$scope.getAllHistoryAdverts = getAllHistoryAdverts;
	
	
	$scope.closeAdvert = closeAdvert;
	$scope.editAdvert = editAdvert;
	
	
	$scope.$on('$destroy',function()
		{	
		$scope.destroyed = true;
		})
	
	$scope.init();
	
	function init()
		{
		$scope.ADVERTS = $models('adverts');
		$scope.ADVERTS_HISTORY = $models('adverts');
		
		$scope.spinner = true;
		$q.all([
				$scope.getAllPrivateAdverts(),
				$scope.getAllHistoryAdverts()
				]).then(function()
					{
					if ($scope.destroyed) return false;
					$scope.spinner = false;
					})
		
		}
		
		
	function getAllPrivateAdverts()
		{
			
		var defer = $q.defer();
			
		$scope.ADVERTS.$get({'filtring':{'onlyUserAdverts':true},'withUsers':true}).then(function(response)
			{			
			defer.resolve();
			})
		return defer.promise;
		}
		
		
		
	function getAllHistoryAdverts()
		{
		var defer = $q.defer();
			
		//history = true means get adverts from advertsHistory collection
		$scope.ADVERTS_HISTORY.$get({'filtring':{'onlyUserAdverts':true,'history':true}}).then(function(response)
			{			
			defer.resolve();
			})
		return defer.promise;	
		}
		
		
		
		
		
	function closeAdvert(advert)
		{
		$mdDialog.show($mdDialog
			.confirm()
			.title('Вы действительно хотите закрыть намерение?')
			.cancel('Вернуться')
			.ok('Продолжить')
			).then(function()
				{
				$scope.spinner = true;
				advert.$close().then(function(response)
					{
					if ($scope.destroyed) return false;
					$scope.spinner = false;
					if (response.Error) return false;
					$scope.ADVERTS_HISTORY.$unshift(response.data);
					})
				})
		}
		
		
		
	function editAdvert(advert)
		{	
		$mdDialog.show({
			'templateUrl':'./views/profile/ModalEditAdvert.html',
			controller:'profileModalEditAdvertCntr',
			muplitple:true,
			//escapeToClose:true,
			//clickOutsideToClose:true,
			locals:{'advert':advert}
			}).then(function(response)
				{
				$.extend(advert,response);
				})
		}
		
		
		
		

		
	}
	
module.exports.$inject = ['$scope','$timeout','$models','$rootScope','$mdDialog','$q'];