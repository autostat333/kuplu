module.exports = function modalEditAdvert($scope,$mdDialog,$models,advert,$timeout)
	{
	
	
	$scope.init = init;
	$scope.checkError = checkError;
	$scope.autofocus = autofocus;
	$scope.closeModal = closeModal;
	$scope.updateAdvert = updateAdvert;
	$scope.equals = equals;
	$scope.isCityOfRegion = isCityOfRegion;
	
	$scope.init();
	
	
	$scope.$watch('selectedRegion',watcherRegion);

	
	function init()
		{
		$scope.spinner = true;
		$scope.REGIONS = $models('regions')
		
		$scope.ADVERTS = $models('adverts');
		$scope.advert = $scope.ADVERTS.$createBlank();

		
		$scope.selectedRegion = '';
		$scope.REGIONS.$get().then(function(response)
			{
			$scope.spinner = false;
			
			//extend new advert with existed params (to prevent overwriting original)
			var keys = Object.keys(advert),key;
			$scope.advertOrg = {};
			for (var i=0;key=keys[i++];)
				{
				$scope.advert[key] = advert[key];
				$scope.advertOrg[key] = advert[key];
				}
			delete $scope.advert['Messages'];delete $scope.advertOrg['Messages'];



			//set choosen region if it is
			var _id;
			if ($scope.advert['Region']&&(_id = $scope.advert['Region']['_id']))
				$scope.selectedRegion = $scope.REGIONS.data.filter(function(el){return el['_id']==_id})[0];


			//set choosen city if it is (it should be in timeout to give time for drawning md-options)
			$timeout(function()
				{
				if ($scope.advert['City']&&$scope.advert['City']['name']&&$scope.selectedRegion)
					{
					var city;
					loop1:
					for (var i=0;city=$scope.selectedRegion['cities'][i++];)
						{
						if (city['name']==advert['City']['name'])
							{
							$scope.advert['City'] = city;
							break loop1;
							}
						}
							
					}
					
				},0)
				
			
			$scope.autofocus('[name=title]');

			});
		
		}
		
		
	function autofocus(selector)
		{
		setTimeout(function()
			{
			$(selector)[0].focus();
			},500) 
		}
		
		
	function checkError(field)
		{
		field = field||'all';
		
		if (field=='all')
			{
			for (var each in $scope.advertEditForm)
				{
				if (each.indexOf('$')!='0'
					&&Object.keys($scope.advertEditForm[each]['$error']).length!=0) return true;
				}
			return false;
				
			}
			
		return Object.keys($scope.advertEditForm[field]['$error']).length!=0;
			
		}
		
		
	function watcherRegion(newVal,oldVal)
		{
		if ($scope.REGIONS&&!$scope.REGIONS.data.length) return false;
		//if (newVal&&!oldVal) return false;
		
		if (!newVal)
			{
			$scope.selectedRegion = '';
			$scope.advert['Region'] = '';
			$scope.advert['City'] = '';
			return false;
			}
			
		if ($scope.advert['City'])
			{
			$scope.advert['City'] = $scope.isCityOfRegion($scope.advert['City'],newVal)?advert['City']:'';
			}
		
		
		$scope.advert['Region'] = angular.copy($scope.selectedRegion);
		delete $scope.advert['Region']['cities'];
		}
		
		
	function isCityOfRegion(city,region)
		{
		loop1:
		for (var i=0,city_;city_=region['cities'][i++];)
			{
			if (city_['name']==city['name']
				&&city_['lat']==city['lat']
				&&city_['lon']==city['lon']
				)
				{
				return true;
				}
			
			}
		return false;
		}
		
		
	function equals()
		{
		return angular.equals($scope.advert,$scope.advertOrg);
		}
		
		
	function updateAdvert()
		{
		if ($scope.advertEditForm.$invalid||$scope.advert.isEmpty())
			return false;
		
		$scope.spinner = true;
		$scope.advert.$update().then(function(response)
			{
			if ($scope.destroyed) return false;
			if (response.Error) return false;
			
			//close modal if success
			if (!response.Error)
				{

				$mdDialog.show($mdDialog
					.okPopup()
					.title('Ваше намерение успешно изменено!')
					)
				$mdDialog.hide($scope.advert);
				}
			$scope.spinner = false;

			})
		
			
		}
		
		
	function closeModal()
		{
		$mdDialog.cancel();
		}
		
		
	}
	
module.exports.$inject = ['$scope','$mdDialog','$models','advert','$timeout'];